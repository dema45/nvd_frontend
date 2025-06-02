// import React, { useState } from "react";
// import IconCard from "./IconCard";
// import { FeatureTitle, FeatureDescription } from "./FeatureComponents";
// import f1 from "../Assets/immutable_voting.png";
// import f2 from "../Assets/decentralization.png";
// import f3 from "../Assets/voter_authentication.png";
// import f4 from "../Assets/tamper_proof.png";
// import f5 from "../Assets/smartcontract.png";
// import f6 from "../Assets/transparency.png";

// const FeatureImage = ({ src, alt, className = "", isSmall = false }) => {
//   const [imgSrc, setImgSrc] = useState(src);

//   const handleError = () => {
//     setImgSrc("https://via.placeholder.com/150");
//   };

//   return (
//     <div className={`flex items-center justify-center w-full h-full ${isSmall ? "p-2" : "p-4"}`}>
//       <img
//         src={imgSrc}
//         alt={alt}
//         onError={handleError}
//         className={`object-contain ${isSmall ? "max-h-[80px]" : "max-h-[100px]"} ${className}`}
//         aria-label={alt}
//       />
//     </div>
//   );
// };

// const VotingFeatures = () => {
//   return (
//     <section id="features" className="w-full px-4 py-8 bg-white rounded-2xl shadow-sm md:px-16 md:py-14">
//       <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
//         {/* Column 1 */}
//         <div className="flex flex-col gap-8">
//           <div className="flex flex-col items-center p-6 border-2 border-gray-200 rounded-xl shadow-sm h-full">
//             <IconCard className="w-[120px] h-[120px] bg-gray-50 border border-gray-200 rounded-lg">
//               <FeatureImage src={f1} alt="Immutable voting" />
//             </IconCard>
//             <FeatureTitle className="mt-5 text-center">
//               Immutable Voting Records
//             </FeatureTitle>
//             <FeatureDescription className="mt-4 text-center">
//               Once votes are recorded on the blockchain, they cannot be altered or tampered with.
//             </FeatureDescription>
//           </div>

//           <div className="flex flex-col items-center p-6 border-2 border-gray-200 rounded-xl shadow-sm h-full">
//             <div className="w-[120px] h-[120px] bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center">
//               <FeatureImage src={f2} alt="Vote chain visualization" isSmall />
//             </div>
//             <FeatureTitle className="mt-5 text-center">
//               Tamper-Proof Vote Chain
//             </FeatureTitle>
//             <FeatureDescription className="mt-4 text-center">
//               Each vote is linked in a blockchain structure with cryptographic hashing.
//             </FeatureDescription>
//           </div>
//         </div>

//         {/* Column 2 */}
//         <div className="flex flex-col gap-8">
//           <div className="flex flex-col items-center p-6 border-2 border-gray-200 rounded-xl shadow-sm h-full">
//             <IconCard className="w-[120px] h-[120px] bg-gray-50 border border-gray-200 rounded-lg">
//               <FeatureImage src={f3} alt="Decentralization" isSmall />
//             </IconCard>
//             <FeatureTitle className="mt-5 text-center">
//               Decentralization & Security
//             </FeatureTitle>
//             <FeatureDescription className="mt-4 text-center">
//               Eliminates the need for a central authority, reducing risks of manipulation.
//             </FeatureDescription>
//           </div>

//           <div className="flex flex-col items-center p-6 border-2 border-gray-200 rounded-xl shadow-sm h-full">
//             <div className="w-[120px] h-[120px] bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center">
//               <FeatureImage src={f4} alt="Smart contract" />
//             </div>
//             <FeatureTitle className="mt-5 text-center">
//               Smart Contract
//             </FeatureTitle>
//             <FeatureDescription className="mt-4 text-center">
//               Self-executing smart contracts automate vote tallying and result declaration.
//             </FeatureDescription>
//           </div>
//         </div>

//         {/* Column 3 */}
//         <div className="flex flex-col gap-8">
//           <div className="flex flex-col items-center p-6 border-2 border-gray-200 rounded-xl shadow-sm h-full">
//             <div className="w-[120px] h-[120px] bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center">
//               <FeatureImage src={f5} alt="Voter authentication" />
//             </div>
//             <FeatureTitle className="mt-5 text-center">
//               Voter Authentication & Privacy
//             </FeatureTitle>
//             <FeatureDescription className="mt-4 text-center">
//               Ensures only authorized voters can cast their votes while maintaining privacy.
//             </FeatureDescription>
//           </div>

//           <div className="flex flex-col items-center p-6 border-2 border-gray-200 rounded-xl shadow-sm h-full">
//             <IconCard className="w-[120px] h-[120px] bg-gray-50 border border-gray-200 rounded-lg">
//               <FeatureImage src={f6} alt="Transparency" isSmall />
//             </IconCard>
//             <FeatureTitle className="mt-5 text-center">
//               Transparency
//             </FeatureTitle>
//             <FeatureDescription className="mt-4 text-center">
//               Every vote is time-stamped and recorded chronologically for verification.
//             </FeatureDescription>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default VotingFeatures;



import React, { useState } from "react";
import IconCard from "./IconCard";
import { FeatureTitle, FeatureDescription } from "./FeatureComponents";
import f1 from "../Assets/immutable_voting.png";
import f2 from "../Assets/decentralization.png";
import f3 from "../Assets/voter_authentication.png";
import f4 from "../Assets/tamper_proof.png";
import f5 from "../Assets/smartcontract.png";
import f6 from "../Assets/transparency.png";

const FeatureImage = ({ src, alt, className = "", isSmall = false }) => {
  const [imgSrc, setImgSrc] = useState(src);

  const handleError = () => {
    setImgSrc("https://via.placeholder.com/150");
  };

  return (
    <div className={`flex items-center justify-center w-full h-full ${isSmall ? "p-2" : "p-4"}`}>
      <img
        src={imgSrc}
        alt={alt}
        onError={handleError}
        className={`object-contain transition-transform duration-300 group-hover:scale-110 ${isSmall ? "max-h-[80px]" : "max-h-[100px]"} ${className}`}
        aria-label={alt}
      />
    </div>
  );
};

const VotingFeatures = () => {
  return (
    <section id="features" className="w-full px-4 py-8 bg-white md:px-16 md:py-14">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Column 1 */}
        <div className="flex flex-col gap-8">
          <div className="group relative flex flex-col items-center p-8 border-2 border-gray-200 rounded-xl bg-white shadow-sm h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-blue-100 hover:bg-blue-50">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <IconCard className="w-[120px] h-[120px] bg-white border border-gray-200 rounded-lg group-hover:bg-blue-50 group-hover:border-blue-200 transition-colors duration-300">
              <FeatureImage src={f1} alt="Immutable voting" />
            </IconCard>
            <FeatureTitle className="mt-5 text-center group-hover:text-blue-600 transition-colors duration-300">
              Immutable Voting Records
            </FeatureTitle>
            <FeatureDescription className="mt-4 text-center">
              Once votes are recorded on the blockchain, they cannot be altered or tampered with.
            </FeatureDescription>
          </div>

          <div className="group relative flex flex-col items-center p-8 border-2 border-gray-200 rounded-xl bg-white shadow-sm h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-purple-100 hover:bg-purple-50">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="w-[120px] h-[120px] bg-white border border-gray-200 rounded-lg flex items-center justify-center group-hover:bg-purple-50 group-hover:border-purple-200 transition-colors duration-300">
              <FeatureImage src={f2} alt="Vote chain visualization" isSmall />
            </div>
            <FeatureTitle className="mt-5 text-center group-hover:text-purple-600 transition-colors duration-300">
              Tamper-Proof Vote Chain
            </FeatureTitle>
            <FeatureDescription className="mt-4 text-center">
              Each vote is linked in a blockchain structure with cryptographic hashing.
            </FeatureDescription>
          </div>
        </div>

        {/* Column 2 */}
        <div className="flex flex-col gap-8">
          <div className="group relative flex flex-col items-center p-8 border-2 border-gray-200 rounded-xl bg-white shadow-sm h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-green-100 hover:bg-green-50">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <IconCard className="w-[120px] h-[120px] bg-white border border-gray-200 rounded-lg group-hover:bg-green-50 group-hover:border-green-200 transition-colors duration-300">
              <FeatureImage src={f3} alt="Decentralization" isSmall />
            </IconCard>
            <FeatureTitle className="mt-5 text-center group-hover:text-green-600 transition-colors duration-300">
              Decentralization & Security
            </FeatureTitle>
            <FeatureDescription className="mt-4 text-center">
              Eliminates the need for a central authority, reducing risks of manipulation.
            </FeatureDescription>
          </div>

          <div className="group relative flex flex-col items-center p-8 border-2 border-gray-200 rounded-xl bg-white shadow-sm h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-indigo-100 hover:bg-indigo-50">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="w-[120px] h-[120px] bg-white border border-gray-200 rounded-lg flex items-center justify-center group-hover:bg-indigo-50 group-hover:border-indigo-200 transition-colors duration-300">
              <FeatureImage src={f4} alt="Smart contract" />
            </div>
            <FeatureTitle className="mt-5 text-center group-hover:text-indigo-600 transition-colors duration-300">
              Smart Contract
            </FeatureTitle>
            <FeatureDescription className="mt-4 text-center">
              Self-executing smart contracts automate vote tallying and result declaration.
            </FeatureDescription>
          </div>
        </div>

        {/* Column 3 */}
        <div className="flex flex-col gap-8">
          <div className="group relative flex flex-col items-center p-8 border-2 border-gray-200 rounded-xl bg-white shadow-sm h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-red-100 hover:bg-red-50">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="w-[120px] h-[120px] bg-white border border-gray-200 rounded-lg flex items-center justify-center group-hover:bg-red-50 group-hover:border-red-200 transition-colors duration-300">
              <FeatureImage src={f5} alt="Voter authentication" />
            </div>
            <FeatureTitle className="mt-5 text-center group-hover:text-red-600 transition-colors duration-300">
              Voter Authentication & Privacy
            </FeatureTitle>
            <FeatureDescription className="mt-4 text-center">
              Ensures only authorized voters can cast their votes while maintaining privacy.
            </FeatureDescription>
          </div>

          <div className="group relative flex flex-col items-center p-8 border-2 border-gray-200 rounded-xl bg-white shadow-sm h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-teal-100 hover:bg-teal-50">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <IconCard className="w-[120px] h-[120px] bg-white border border-gray-200 rounded-lg group-hover:bg-teal-50 group-hover:border-teal-200 transition-colors duration-300">
              <FeatureImage src={f6} alt="Transparency" isSmall />
            </IconCard>
            <FeatureTitle className="mt-5 text-center group-hover:text-teal-600 transition-colors duration-300">
              Transparency
            </FeatureTitle>
            <FeatureDescription className="mt-4 text-center">
              Every vote is time-stamped and recorded chronologically for verification.
            </FeatureDescription>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VotingFeatures;