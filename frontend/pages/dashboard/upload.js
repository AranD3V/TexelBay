import { useState } from 'react';
import { useRouter } from 'next/router';
import api from '../../utils/api'; // Your pre-configured axios instance
import axios from 'axios'; // Needed for the direct S3 upload

/**
 * A component for the creator dashboard that handles new asset uploads.
 * It manages a multi-step process:
 * 1. Gets a secure, pre-signed URL from the backend API.
 * 2. Uploads the selected file directly to AWS S3.
 * 3. Submits the asset's metadata to the backend API to create a database record.
 */
export default function UploadAsset() {
  const router = useRouter();

  // Form state for text inputs
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    tags: '',
  });
  // State for the file to be uploaded
  const [assetFile, setAssetFile] = useState(null);
  
  // UI/UX state
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { title, description, price, tags } = formData;

  // Handles changes in text inputs
  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handles file selection
  const onFileChange = e => {
    const file = e.target.files[0];
    if (file) {
      setAssetFile(file);
    }
  };

  /**
   * Orchestrates the entire asset upload process when the form is submitted.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!assetFile) {
      setError('Please select a file to upload.');
      return;
    }
    setIsLoading(true);
    setError('');
    setSuccess('');
    setUploadProgress(0);

    try {
      // Step 1: Get a pre-signed URL from our backend API.
      // This tells our server we intend to upload a file.
      console.log('Requesting pre-signed URL...');
      const { data: uploadData } = await api.post('/assets/upload-url', {
        fileName: assetFile.name,
        fileType: assetFile.type,
      });
      
      const { signedUrl, fileKey } = uploadData;

      // Step 2: Upload the file directly to S3 using the pre-signed URL.
      // We use axios for this to get access to upload progress events.
      console.log('Uploading file directly to S3...');
      await axios.put(signedUrl, assetFile, {
        headers: {
          'Content-Type': assetFile.type,
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        },
      });

      // Step 3: Create the asset record in our database via our backend API.
      // This links the S3 file to the asset's metadata.
      console.log('Creating asset record in database...');
      const assetPayload = {
        title,
        description,
        price: parseFloat(price),
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag), // Convert string to array and remove empty tags
        assetFileKey: fileKey,
      };

      const { data: newAsset } = await api.post('/assets', assetPayload);
      
      setSuccess(`Asset "${newAsset.title}" uploaded successfully! Redirecting...`);
      
      // Redirect to the new asset's detail page after a short delay
      setTimeout(() => {
        router.push(`/assets/${newAsset._id}`);
      }, 2000);

    } catch (err) {
      console.error(err);
      setError('An error occurred during upload. Please check the console and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center text-white">
      <div className="w-full max-w-2xl p-8 space-y-8 bg-gray-800 rounded-lg shadow-lg">
        <div>
          <h1 className="text-3xl font-bold text-center">Upload New Asset</h1>
          <p className="mt-2 text-center text-gray-400">Fill in the details to add your asset to the marketplace.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-300">Title</label>
              <input id="title" name="title" type="text" value={title} onChange={onChange} required className="w-full px-3 py-2 mt-1 text-gray-200 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g., Low Poly Fantasy Sword" />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300">Description</label>
              <textarea id="description" name="description" value={description} onChange={onChange} required rows="4" className="w-full px-3 py-2 mt-1 text-gray-200 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Describe your asset, its poly count, format, etc."></textarea>
            </div>
            <div className="flex space-x-4">
              <div className="flex-1">
                <label htmlFor="price" className="block text-sm font-medium text-gray-300">Price (USD)</label>
                <input id="price" name="price" type="number" value={price} onChange={onChange} required min="0" step="0.01" className="w-full px-3 py-2 mt-1 text-gray-200 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="19.99" />
              </div>
              <div className="flex-1">
                <label htmlFor="tags" className="block text-sm font-medium text-gray-300">Tags</label>
                <input id="tags" name="tags" type="text" value={tags} onChange={onChange} className="w-full px-3 py-2 mt-1 text-gray-200 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="sword, fantasy, low-poly" />
              </div>
            </div>
             <div>
                <label htmlFor="asset-file" className="block text-sm font-medium text-gray-300">Asset File</label>
                <input id="asset-file" type="file" onChange={onFileChange} required className="w-full px-3 py-2 mt-1 text-gray-400 bg-gray-700 border border-gray-600 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"/>
                {assetFile && <p className="mt-2 text-sm text-gray-400">Selected: {assetFile.name}</p>}
            </div>
          </div>

          {/* Loading and Feedback Section */}
          {isLoading && (
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
            </div>
          )}
          {error && <p className="text-sm text-center text-red-400">{error}</p>}
          {success && <p className="text-sm text-center text-green-400">{success}</p>}

          {/* Submit Button */}
          <div>
            <button type="submit" disabled={isLoading} className="w-full px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
              {isLoading ? `Uploading... ${uploadProgress}%` : 'Submit Asset'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
