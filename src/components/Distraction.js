import React, { useEffect, useState } from "react";
import Lottie from "lottie-react";
import styled from "@emotion/styled";

const AbsoluteLottie = styled(Lottie)`
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

const lottieFiles = [
  "https://assets5.lottiefiles.com/datafiles/1jUq06Xn8mNO5Zb/data.json",
  "https://assets6.lottiefiles.com/private_files/lf30_jyxnt8gq.json",
  "https://assets5.lottiefiles.com/packages/lf20_vuubgscl.json",
  "https://assets5.lottiefiles.com/packages/lf20_9dmzmwdm.json",
  "https://assets5.lottiefiles.com/packages/lf20_5zuxkkw9.json",
  "https://assets5.lottiefiles.com/packages/lf20_rd4wrn81.json",
  "https://assets5.lottiefiles.com/private_files/lf30_axdai8zf.json",
  "https://assets3.lottiefiles.com/packages/lf20_nfnlie0x.json",
  "https://assets10.lottiefiles.com/private_files/lf30_9h6rozkg.json",
];
function Distraction() {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    const randomLottieFile =
      lottieFiles[Math.floor(Math.random() * lottieFiles.length)];
    fetch(randomLottieFile)
      .then((response) => response.json())
      .then(setAnimationData);
  }, []);

  if (!animationData) {
    return null;
  }

  return (
    <AbsoluteLottie
      animationData={animationData}
      width={800}
      height={600}
      loop
    />
  );
}

export default Distraction;
