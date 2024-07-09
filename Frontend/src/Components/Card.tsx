type Props = {
    description: string
    header: string
    highlight?: string
}
export default function Card({ header, description, highlight }: Props) {
    return (
        <div
            className={`min-h-[59px] ${
                highlight
                    ? `bg-[${highlight}]`
                    : "bg-green-600 dark:bg-[#244935]"
            } rounded-[5px] p-[10px] flex items-center overflow-hidden cursor-pointer shadow-card`}
        >
            <p className="text-white text-left">
                <strong className="capitalize">{header + ":"}</strong>&nbsp;{description}
            </p>
        </div>
    )
}
