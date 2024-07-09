import ThemeToggle from "./ThemeToggle"

export default function NavigationBar() {
    return (
        <nav className="w-full bg-white-4 dark:bg-dark-2 p-2 flex">
            <img
                src="/icon-2000x2000.png"
                alt="logo-loading"
                className="w-[56px] h-[56px] ml-[12px] cursor-pointer"
            />
            <div className="h-full flex flex-col justify-center ml-[15px]">
                <h1 className="text-[25px] dark:text-white cursor-pointer">
                Green
                    <span className="font-[1000] text-green-600 dark:text-newGreen-1">
                   Guardians
                    </span>
                </h1>
                <p className="text-[16px] text-dark-3 dark:text-white-3 mt-[-5px]">
                    {/* Safeguarding crops, one leaf at a time! */}
                    Plant-based diseases detection system
                </p>
            </div>
            <div className="ml-[auto] flex justify-center items-center space-x-14">
                
                { <button className="rounded-[9px] cursor-pointer self-center w-[134px] h-[40px] bg-orange-600 dark:bg-newGreen-2 text-white text-[17px]">
                    Plant ID
                </button> }

                { <button className="rounded-[9px] cursor-pointer self-center w-[134px] h-[40px] bg-orange-600 dark:bg-newGreen-2 text-white text-[17px]">
                    Disease ID
                </button> }

                { <button className="rounded-[9px] cursor-pointer self-center w-[134px] h-[40px] bg-orange-600 dark:bg-newGreen-2 text-white text-[17px]">
                    Sign in
                </button> }

            </div>
            
            <div className="ml-[auto] flex justify-center items-center">
                <ThemeToggle rtype="switch" />
                { <button className="rounded-[9px] cursor-pointer self-center w-[134px] h-[40px] bg-orange-600 dark:bg-newGreen-2 text-white text-[17px]">
                    View History
                </button> }
            </div>
        </nav>
        
    )
}
