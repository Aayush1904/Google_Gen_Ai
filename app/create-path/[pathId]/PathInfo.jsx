//Original : 

// import { Button } from '@/components/ui/button';
// import Image from 'next/image';
// import React, { useEffect, useState } from 'react';
// import { HiOutlinePuzzlePiece } from 'react-icons/hi2';
// import EditPathInfo from './EditPathInfo';
// import { db } from '@/configs/db';
// import { PathList } from '@/configs/schema';
// import { eq } from 'drizzle-orm';

// const PathInfo = ({ path , refreshData }) => {
//   const [selectedFile, setSelectedFile] = useState();

//   useEffect(() => {
//     if(path){
//       setSelectedFile(path?.pathImage)
//     }
//   },[path])

//   const onFileSelected = async (event) => {
//     const file = event.target.files[0];
//     setSelectedFile(URL.createObjectURL(file));

//     // Cloudinary setup
//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET); // Set your unsigned upload preset
//     formData.append('folder', 'learning-path-images'); // Optional: specify a folder in Cloudinary

//     try {
//       const response = await fetch(
//         `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
//         {
//           method: 'POST',
//           body: formData,
//         }
//       );

//       const data = await response.json();
//       console.log('Cloudinary File URL:', data.secure_url);

//       await db.update(PathList).set({
//         pathImage : data.secure_url
//       }).where(eq(PathList.id , path?.id))

//       // Use `data.secure_url` to store or update the image URL in your database if needed
//     } catch (error) {
//       console.error('Error uploading file to Cloudinary:', error);
//     }
//   };

//   return (
//     <div className="p-8 border rounded-xl shadow-lg mt-6">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         {/* Left Section */}
//         <div className="flex flex-col justify-between">
//           <div>
//             <h2 className="text-3xl font-extrabold text-gray-800 dark:text-gray-100">
//               {path?.pathOutput?.learningPath?.pathName} <EditPathInfo path = {path} refreshData={() => refreshData(true)}/>
//             </h2>
//             <p className="text-gray-600 dark:text-gray-400 text-base mt-4 leading-relaxed">
//               {path?.pathOutput?.learningPath?.description}
//             </p>
//             <h2 className="flex items-center gap-2 text-gray-700 dark:text-gray-300 mt-3 text-lg">
//               <HiOutlinePuzzlePiece className="text-xl text-primary" />
//               {path?.category}
//             </h2>
//           </div>
//           <Button className="mt-6 bg-green-400 w-full md:w-auto">
//             Let’s Go
//           </Button>
//         </div>

//         {/* Right Section */}
//         <div>
//           <label htmlFor='upload-image'>
//             <Image
//               src={selectedFile?selectedFile:'/placeholder.svg'}
//               alt={path?.pathOutput?.learningPath?.pathName}
//               width={300}
//               height={300}
//               className="rounded-xl object-cover shadow-md w-full h-[250px] cursor-pointer"
//             />
//           </label>
//           <input type="file" id="upload-image" className='opacity-0' onChange={onFileSelected}/>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PathInfo;


import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react';
import { HiOutlinePuzzlePiece } from 'react-icons/hi2';
import EditPathInfo from './EditPathInfo';
import { db } from '@/configs/db';
import { PathList } from '@/configs/schema';
import { eq } from 'drizzle-orm';
import FileUploadDropzone from '@/app/_components/FileUploaderDropZone';

const PathInfo = ({ path, refreshData }) => {
  const [selectedFile, setSelectedFile] = useState();
  const [uploadedFileUrl, setUploadedFileUrl] = useState(null);

  useEffect(() => {
    if (path) {
      setSelectedFile(path?.pathImage);
    }
  }, [path]);

  const handleFileUpload = async (files) => {
    const file = files[0]; // Since we're limiting to one file
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET); // Unsigned upload preset
    formData.append('folder', 'learning-path-images'); // Optional Cloudinary folder

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();
      console.log('Cloudinary File URL:', data.secure_url);

      // Update the uploaded file URL
      setUploadedFileUrl(data.secure_url);

      // Update database with new image URL
      await db.update(PathList).set({
        pathImage: data.secure_url,
      }).where(eq(PathList.id, path?.id));

      // Trigger data refresh
      refreshData(true);
    } catch (error) {
      console.error('Error uploading file to Cloudinary:', error);
    }
  };

  return (
    <div className="p-8 border rounded-xl shadow-lg mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Section */}
        <div className="flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-800 dark:text-gray-100">
              {path?.pathOutput?.learningPath?.pathName} <EditPathInfo path={path} refreshData={() => refreshData(true)} />
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-base mt-4 leading-relaxed">
              {path?.pathOutput?.learningPath?.description}
            </p>
            <h2 className="flex items-center gap-2 text-gray-700 dark:text-gray-300 mt-3 text-lg">
              <HiOutlinePuzzlePiece className="text-xl text-primary" />
              {path?.category}
            </h2>
          </div>
          <Button className="mt-6 bg-green-400 w-full md:w-auto">
            Let’s Go
          </Button>
        </div>

        {/* Right Section */}
        <div className='flex justify-center items-center p-4 sm:p-8'>
          <FileUploadDropzone
            onValueChange={(files) => handleFileUpload(files)}
          />
        </div>
      </div>
    </div>
  );
};

export default PathInfo;
