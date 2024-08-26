import Image from "next/image";

export const Hero: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center max-w-5xl">
      <div className="flex items-center">
        <div
          className="relative w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] md:w-[400px] md:h-[400px]
          hidden md:block"
        >
          <Image
            src={"/hero.png"}
            alt="Documents"
            fill
            className="object-contain dark:hidden"
          />
          <Image
            src={"/hero-dark.png"}
            alt="Documents"
            fill
            className="object-contain hidden dark:block"
          />
        </div>

        <div className="relative w-[400px] h-[400px] md:hidden">
          <Image
            src={"/reading.png"}
            alt="Reading"
            fill
            className="object-contain dark:hidden"
          />
          <Image
            src={"/reading-dark.png"}
            alt="Reading"
            fill
            className="object-contain hidden dark:block"
          />
        </div>
      </div>
    </div>
  );
};
