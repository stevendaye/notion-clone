import Image from "next/image";

export const Hero = () => {
  return (
    <div className="flex flex-col justify-center items-center max-w-5xl">
      <div className="flex items-center">
        <div
          className="relative w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] md:w-[400px] md:h-[400px]
          hidden md:block"
        >
          <Image
            src={"/documents.png"}
            className="object-contain dark:hidden"
            alt="Documents"
            fill
          />
          <Image
            src={"/documents-dark.png"}
            className="object-contain hidden dark:block"
            alt="Documents"
            fill
          />
        </div>

        <div className="relative w-[400px] h-[400px] md:hidden">
          <Image
            src={"/reading.png"}
            className="object-contain dark:hidden"
            alt="Reading"
            fill
          />
          <Image
            src={"/reading-dark.png"}
            className="object-contain hidden dark:block"
            alt="Reading"
            fill
          />
        </div>
      </div>
    </div>
  );
};
