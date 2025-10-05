import { ThreeDots } from "react-loader-spinner";

const Loading = () => {
  return (
    <div className="flex justify-center items-center h-screen w-screen">
      <ThreeDots
        visible={true}
        height="80"
        width="80"
        color="#fc6011"
        radius="9"
        ariaLabel="three-dots-loading"
      />
    </div>
  );
};

export default Loading;