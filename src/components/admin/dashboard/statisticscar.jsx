import React from "react";

const StatisticsCards = ({ totalVoters, totalSessions, totalParties }) => {
  return (
    <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-100 p-4 md:p-6 mb-4 md:mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {/* Total Voters Card */}
        <div className="bg-gray-50 rounded-2xl p-3 md:p-4 flex items-center justify-between border border-gray-200">
          <div className="flex items-center justify-center w-14 h-14 md:w-20 md:h-20 rounded-full bg-[#8C2C9E]/10 ml-6">
            <svg
              width="70"
              height="70"
              viewBox="0 0 84 84"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="scale-125"
            >
              <circle
                cx="42"
                cy="42"
                r="42"
                fill="url(#paint0_linear_1337_56)"
              />
              <path
                d="M38.0266 41.0225C37.8516 41.005 37.6416 41.005 37.4491 41.0225C33.2841 40.8825 29.9766 37.47 29.9766 33.27C29.9766 28.9825 33.4416 25.5 37.7466 25.5C42.0341 25.5 45.5166 28.9825 45.5166 33.27C45.4991 37.47 42.1916 40.8825 38.0266 41.0225Z"
                stroke="white"
                strokeWidth="2.625"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M50.7197 29C54.1147 29 56.8447 31.7475 56.8447 35.125C56.8447 38.4325 54.2197 41.1275 50.9472 41.25C50.8072 41.2325 50.6497 41.2325 50.4922 41.25"
                stroke="white"
                strokeWidth="2.625"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M29.2778 47.48C25.0428 50.315 25.0428 54.935 29.2778 57.7525C34.0903 60.9725 41.9828 60.9725 46.7953 57.7525C51.0303 54.9175 51.0303 50.2975 46.7953 47.48C42.0003 44.2775 34.1078 44.2775 29.2778 47.48Z"
                stroke="white"
                strokeWidth="2.625"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M54.0938 57C55.3538 56.7375 56.5437 56.23 57.5237 55.4775C60.2537 53.43 60.2537 50.0525 57.5237 48.005C56.5612 47.27 55.3888 46.78 54.1463 46.5"
                stroke="white"
                strokeWidth="2.625"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_1337_56"
                  x1="74.55"
                  y1="2.14197e-06"
                  x2="42"
                  y2="84"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#8EA5FE" />
                  <stop offset="0.5" stopColor="#BB4D98" />
                  <stop offset="1" stopColor="#90D1FF" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="text-right">
            <p className="text-xs md:text-sm text-gray-600">
              Total Voters
            </p>
            <p className="text-xl md:text-2xl font-bold text-gray-800">
              {totalVoters}
            </p>
          </div>
        </div>
        {/* Total Session */}
        <div className="bg-gray-50 rounded-2xl p-3 md:p-4 flex items-center justify-between border border-gray-200">
          <div className="flex items-center justify-center w-14 h-14 md:w-20 md:h-20 rounded-full bg-[#8C2C9E]/10 ml-6">
            <svg
              width="70"
              height="70"
              viewBox="0 0 84 84"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="scale-125"
            >
              <circle
                cx="42"
                cy="42"
                r="42"
                fill="url(#paint0_linear_1337_58)"
              />
              <path
                d="M32.27 24.5H51.7125C57.9425 24.5 59.5 26.0575 59.5 32.27V43.3475C59.5 49.5775 57.9425 51.1175 51.73 51.1175H32.27C26.0575 51.135 24.5 49.5775 24.5 43.365V32.27C24.5 26.0575 26.0575 24.5 32.27 24.5Z"
                stroke="white"
                strokeWidth="2.625"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M42 51.1328V59.4978"
                stroke="white"
                strokeWidth="2.625"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M24.5 43.75H59.5"
                stroke="white"
                strokeWidth="2.625"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M34.125 59.5H49.875"
                stroke="white"
                strokeWidth="2.625"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_1337_58"
                  x1="74.55"
                  y1="2.14197e-06"
                  x2="42"
                  y2="84"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#8EA5FE" />
                  <stop offset="0.5" stopColor="#BB4D98" />
                  <stop offset="1" stopColor="#90D1FF" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="text-right">
            <p className="text-xs md:text-sm text-gray-600">
              Total Sessions
            </p>
            <p className="text-xl md:text-2xl font-bold text-gray-800">
              {totalSessions}
            </p>
          </div>
        </div>

        {/* Total Parties Card */}
        <div className="bg-gray-50 rounded-2xl p-3 md:p-4 flex items-center justify-between border border-gray-200">
          <div className="flex items-center justify-center w-14 h-14 md:w-20 md:h-20 rounded-full bg-[#8C2C9E]/10 ml-6">
            <svg
              width="84"
              height="84"
              viewBox="0 0 84 84"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="42"
                cy="42"
                r="42"
                fill="url(#paint0_linear_1450_87)"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M38.7681 23.497C36.6156 23.9872 34.8103 25.8161 34.2404 28.0842C34.0053 29.0199 34.005 30.3783 34.2397 31.2734C34.4363 32.0237 34.7791 32.7935 35.1879 33.4034C35.4392 33.7781 35.4531 33.8272 35.3295 33.9008C34.9364 34.1346 33.9184 35.1002 33.4837 35.6518C32.3422 37.1001 31.6998 38.8072 31.4925 40.9425L31.4451 41.4304H30.3702C29.1491 41.4304 19.5 41.4304 18.5 41.4304C18.5 41.4304 18.5 41.603 18.5 43.2971V45.3711V46.8609C19.5 46.8609 23.4617 46.8711 24 46.8711V49.5V55.5C24 61.2138 23.9051 61.1294 24 61.3707C24.5 61.5 29.898 61.3707 40.0018 61.3707C50.1056 61.3707 56.5 61.3707 57 61.3707C57 61.7413 57 60.2138 57 54.5V48V47C57.5383 47 61.5017 46.8711 62.0017 46.8711V45.3711V44.2347C62.0017 42.5407 62.1051 41.5836 62.0017 41.3711C61.5017 41.3711 50.8544 41.4304 49.6334 41.4304H48.5584L48.5092 40.9425C48.2649 38.5215 47.5932 36.8861 46.1577 35.2175C45.7928 34.7933 45.0065 34.0984 44.6548 33.8894C44.5576 33.8316 44.586 33.7459 44.8157 33.4034C45.5806 32.2624 45.9394 31.0664 45.9332 29.6783C45.9282 28.5389 45.7405 27.7163 45.263 26.7411C44.6594 25.5087 43.3921 24.2931 42.189 23.7929C41.1694 23.3689 39.8369 23.2536 38.7681 23.497ZM41.3252 25.4028C42.6802 25.8433 43.8622 27.2486 44.1601 28.7731C44.289 29.4331 44.2165 30.5865 44.0072 31.2023C43.5277 32.6135 42.3333 33.7415 40.9519 34.0875C39.2393 34.5163 37.4479 33.7419 36.4373 32.1357C36.0285 31.4862 35.8288 30.8079 35.7876 29.929C35.7282 28.6637 36.0697 27.6123 36.8375 26.6971C37.9724 25.3442 39.6537 24.8593 41.3252 25.4028ZM37.4462 35.3865C39.0412 36.2162 40.9469 36.2071 42.6261 35.3618L43.2139 35.0659L43.7618 35.4529C45.2312 36.4908 46.3114 38.1857 46.6635 40.0055C46.733 40.3652 46.79 40.833 46.79 41.045V41.4304H40.0018H33.2136V41.045C33.2136 39.7256 33.8896 37.9591 34.8729 36.7093C35.3416 36.1135 36.7306 34.9986 36.8872 35.0926C36.9092 35.1057 37.1607 35.238 37.4462 35.3865ZM59.5017 44.3711V45.3711L40.0018 45.079H20V44V43.2971H40.0018L59.5017 43.3711V44.3711ZM55 53V60H40.0018H26V53.6943V47L40.0018 46.8609L55 47V53Z"
                fill="white"
              />
              <path
                d="M56 28C56 31.3137 53.3137 34 50 34C46.6863 34 44 31.3137 44 28C44 24.6863 46.6863 22 50 22C53.3137 22 56 24.6863 56 28ZM45.5164 28C45.5164 30.4762 47.5238 32.4836 50 32.4836C52.4762 32.4836 54.4836 30.4762 54.4836 28C54.4836 25.5238 52.4762 23.5164 50 23.5164C47.5238 23.5164 45.5164 25.5238 45.5164 28Z"
                fill="white"
              />
              <path
                d="M26.5094 32.1875C25.5934 32.4224 24.7459 32.8713 24.036 33.4961C23.3261 34.1209 22.7739 34.9025 22.4246 35.7812C22.0752 36.66 21.9384 37.6091 22.0255 38.5508C22.1126 39.4924 22.4954 40.7002 23 41.5H25C24.6229 40.9024 23.6005 39.1177 23.5354 38.4141C23.4704 37.7104 23.5725 37.0004 23.8336 36.3438C24.0947 35.6871 24.5073 35.0997 25.0378 34.6328C25.5683 34.1659 26.8155 33.6715 27.5 33.4959L26.5094 32.1875Z"
                fill="white"
              />
              <path
                d="M52.9906 32C53.9066 32.2349 54.7541 32.6838 55.464 33.3086C56.1739 33.9334 56.7261 34.715 57.0754 35.5938C57.4248 36.4725 57.5616 37.4216 57.4745 38.3633C57.3874 39.3049 57.0046 40.5127 56.5 41.3125H54.5C54.8771 40.7149 55.8995 38.9302 55.9646 38.2266C56.0296 37.5229 55.9275 36.8129 55.6664 36.1562C55.4053 35.4996 54.9927 34.9122 54.4622 34.4453C53.9317 33.9784 52.6845 33.484 52 33.3084L52.9906 32Z"
                fill="white"
              />
              <path
                d="M36 28C36 31.3137 33.3137 34 30 34C26.6863 34 24 31.3137 24 28C24 24.6863 26.6863 22 30 22C33.3137 22 36 24.6863 36 28ZM25.5164 28C25.5164 30.4762 27.5238 32.4836 30 32.4836C32.4762 32.4836 34.4836 30.4762 34.4836 28C34.4836 25.5238 32.4762 23.5164 30 23.5164C27.5238 23.5164 25.5164 25.5238 25.5164 28Z"
                fill="white"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_1450_87"
                  x1="74.55"
                  y1="2.14197e-06"
                  x2="42"
                  y2="84"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#8EA5FE" />
                  <stop offset="0.5" stopColor="#BB4D98" />
                  <stop offset="1" stopColor="#90D1FF" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="text-right">
            <p className="text-xs md:text-sm text-gray-600">
              Total Parties
            </p>
            <p className="text-xl md:text-2xl font-bold text-gray-800">
              {totalParties}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsCards;