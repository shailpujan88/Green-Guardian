import { useState } from "react"
import Card from "./Card"

type Props = {
    description: {
        header: string
        description: string
    }[]
    treatment: {
        header: string
        description: string
    }[]
}
export default function TabBar({ description, treatment }: Props) {
    const [tabState, setTabState] = useState<"description" | "treatment">(
        "description"
    )
    return (
        <div className="w-full h-full">
            <div className="tab-bar flex gap-4 h-[35px] mt-2 list-none">
                <li
                    onClick={() => setTabState("description")}
                    className={`${
                        tabState === "description" ? "tab-active" : ""
                    } cursor-pointer w-[100px] h-full dark:text-white p-1 rounded-[5px]`}
                >
                    Description
                </li>
                <li
                    onClick={() => setTabState("treatment")}
                    className={`${
                        tabState === "treatment" ? "tab-active" : ""
                    } cursor-pointer w-[100px] h-full dark:text-white p-1 rounded-[5px]`}
                >
                    Treatments
                </li>
            </div>
            <div className="tab-content mt-5 flex flex-col gap-4">
                {tabState === "description"
                    ? description.map((data, index) => (
                          <Card
                              header={data.header}
                              description={data.description}
                              key={`description-${index}`}
                          />
                      ))
                    : treatment.map((data, index) => (
                          <Card
                              header={data.header}
                              description={data.description}
                              key={`treatment-${index}`}
                          />
                      ))}
            </div>
            <div className="h-[30px]" />
        </div>
    )
}
