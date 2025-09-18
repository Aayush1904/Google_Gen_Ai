// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Image from "next/image";

// const UnsplashImage = ({ query }) => {
//   const [imageUrl, setImageUrl] = useState("");
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchImage = async () => {
//       try {
//         const { data } = await axios.get(
//           `https://api.unsplash.com/search/photos?per_page=1&query=${query}&client_id=${process.env.NEXT_PUBLIC_UNSPLASH_API_KEY}`
//         );
//         setImageUrl(data.results[0]?.urls.small_s3 || "");
//       } catch (err) {
//         setError("Failed to fetch the image.");
//       }
//     };

//     fetchImage();
//   }, [query]);

//   if (error) {
//     return <div>{error}</div>;
//   }

//   if (!imageUrl) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div>
//       <Image src={imageUrl} alt={query} />
//     </div>
//   );
// };

// export default UnsplashImage;


import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";

const UnsplashImage = ({ query }) => {
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const { data } = await axios.get(
          `https://api.unsplash.com/search/photos?per_page=1&query=${query}&client_id=${process.env.NEXT_PUBLIC_UNSPLASH_API_KEY}`
        );
        const image = data.results[0]?.urls?.small_s3 || ""; // Use Unsplash's small_s3 size for faster load times
        setImageUrl(image || "/placeholder.jpg"); // Use a default placeholder if no image is found
      } catch (err) {
        console.error(err);
        setError("Failed to fetch the image.");
      }
    };

    fetchImage();
  }, [query]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!imageUrl) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative w-full h-64">
      <Image
        src={imageUrl}
        alt={`Unsplash image for ${query}`}
        layout="fill"
        objectFit="cover"
        className="rounded-lg shadow-lg"
      />
    </div>
  );
};

export default UnsplashImage;
