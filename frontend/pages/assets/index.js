import api from '../../utils/api';
import AssetCard from '../../components/AssetCard';
import Navbar from '../../components/Navbar'; // Assuming you have a Navbar component

/**
 * The main marketplace browse page.
 * It fetches all assets from the API at build time using getStaticProps
 * and displays them in a responsive grid.
 */
export default function BrowseAssetsPage({ assets }) {
  return (
    <div className="bg-gray-900 min-h-screen text-white">
      {/* <Navbar /> */}
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-2 text-center">Explore the Marketplace</h1>
        <p className="text-lg text-gray-400 mb-8 text-center">Find the perfect assets for your next game.</p>
        
        {assets.length === 0 ? (
          <p className="text-center text-gray-500">No assets have been uploaded yet. Be the first!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {assets.map(asset => (
              <AssetCard key={asset._id} asset={asset} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

/**
 * Next.js function to fetch data at build time.
 * This pre-renders the page with the assets, making it fast and SEO-friendly.
 */
export async function getStaticProps() {
  try {
    const { data: assets } = await api.get('/assets');
    return {
      props: {
        assets: assets || [],
      },
      revalidate: 60, // Re-generate the page every 60 seconds to show new assets
    };
  } catch (error) {
    console.error("Failed to fetch assets:", error);
    return {
      props: {
        assets: [],
      },
    };
  }
}
