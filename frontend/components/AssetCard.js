import Link from 'next/link';

/**
 * A reusable UI component to display a summary of an asset.
 * It shows a preview image (placeholder for now), title, creator, and price.
 * The entire card is clickable and links to the asset's detail page.
 *
 * @param {object} asset - The asset object containing details to display.
 */
export default function AssetCard({ asset }) {
  // A simple placeholder image. In a real app, you'd generate a URL
  // to a preview image stored in your S3 bucket.
  const placeholderImageUrl = `https://placehold.co/600x400/1F2937/FFFFFF?text=${encodeURIComponent(asset.title)}`;

  return (
    <Link href={`/assets/${asset._id}`}>
      <div className="group block bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 ease-in-out transform hover:-translate-y-1 cursor-pointer">
        {/* Image Container */}
        <div className="relative w-full h-48">
          <img
            src={placeholderImageUrl}
            alt={`Preview of ${asset.title}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-colors duration-300"></div>
        </div>

        {/* Content Container */}
        <div className="p-4">
          <h3 className="text-lg font-bold text-white truncate group-hover:text-indigo-400 transition-colors">
            {asset.title}
          </h3>
          <p className="text-sm text-gray-400 mt-1">
            by {asset.creator?.name || 'Unknown Creator'}
          </p>
          
          <div className="mt-4 flex justify-between items-center">
            <p className="text-xl font-semibold text-white">
              ${parseFloat(asset.price).toFixed(2)}
            </p>
            <span className="px-3 py-1 text-xs font-semibold text-indigo-200 bg-indigo-600/50 rounded-full">
              3D Model
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
