import CircularProgress from "@mui/material/CircularProgress"
import Box from "@mui/material/Box"
import React, { useCallback, useEffect, useState } from "react"
import { Toaster, toast } from "sonner"
import axios, { AxiosError } from "axios"
import TabBar from "./TabBar"

type Props = {
    onPress?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
    image?: {
        name: string
        data?: string | null
    } | null
}
export default function UploadForm({ image, onPress }: Props) {
    // Defining Hooks
    const [diseaseState, setDiseaseState] = useState<{
        disease: string
        species: string

        treatments: {
            header: string
            description: string
        }[]
        descriptions: {
            header: string
            description: string
        }[]
    } | null>(null)

    let uploadImage: undefined | ((data: typeof image) => void) = undefined
    const handleError = useCallback(
        (error: unknown) => {
            if (error instanceof AxiosError) {
                if (!error.response) return console.error(error.message)

                const statusCode = error.response?.status
                if (statusCode === 500)
                    toast.error(
                        "Cannot upload your image due to Server error. Please try again later.",
                        {
                            action: {
                                label: "Try again",
                                onClick: () => uploadImage?.(image),
                            },
                        }
                    )
                else if (statusCode === 400 || statusCode === 415)
                    toast.error(
                        error.response.data.message ??
                            "Cannot process your data due to some user-side errors."
                    )
                else if (statusCode === 422)
                    toast.error(
                        "Cannot predict the disease in the image. Please select another image.",
                        {
                            action: {
                                label: "Why?",
                                onClick: () => {
                                    toast.error(
                                        <div>
                                            <p className="font-semibold text-[16px] mb-2">
                                                Possible Reasons for Detection
                                                Failure
                                            </p>
                                            <ol className="list-decimal list-inside pl-5 pr-5 flex flex-col gap-2">
                                                <li>
                                                    The image is <b>unclear</b>,
                                                    making it difficult to
                                                    accurately identify the
                                                    disease.
                                                </li>
                                                <li>
                                                    The image <b>size</b> is too{" "}
                                                    <b>broad</b>. Please take a{" "}
                                                    <b>close-up</b> picture of
                                                    the <b>plant leaf</b> for
                                                    better results.
                                                </li>
                                                <li>
                                                    The disease is{" "}
                                                    <b>not registered</b> in our
                                                    database.
                                                </li>
                                            </ol>
                                        </div>
                                    )
                                },
                            },
                        }
                    )
            } else if (error instanceof Error) console.error(error.message)
            else console.error(error)
        },
        [image, uploadImage]
    )

    // Defining Fuctions
    uploadImage = useCallback(
        (data: typeof image) => {
            if (!data || !data.data) return

            setDiseaseState(null)
            toast.info("Your request is being processed. Please wait a moment.")

            const formData = new FormData()
            const file = prepareFileForUpload(data.data, data.name)
            formData.append("image", file)
            axios
                .post("/api/disease/predict", formData)
                .then((data) => {
                    const result = data.data
                    if (!result.status) throw new Error(result.message)
                    toast.success("You request has been processed.")

                    const descriptions: {
                        header: string
                        description: string
                    }[] = Object.entries(result.data.descriptions).map(
                        ([key, value]) => ({
                            header: key,
                            description: value as string,
                        })
                    )
                    const treatments: {
                        header: string
                        description: string
                    }[] = Object.entries(result.data.treatments).map(
                        ([key, value]) => ({
                            header: key,
                            description: value as string,
                        })
                    )

                    setDiseaseState({
                        descriptions,
                        treatments,
                        disease: result.data.disease,
                        species: result.data.species,
                    })
                })
                .catch(handleError)
        },
        [handleError]
    )

    function prepareFileForUpload(image: string, name: string): File {
        const arr = image.split(",")
        const mime = arr[0].match(/:(.*?);/)![1] //? ! -> TypeScript Special
        const bstr = atob(arr[1])

        let n = bstr.length
        const u8arr = new Uint8Array(n)
        while (n--) u8arr[n] = bstr.charCodeAt(n)
        return new File([u8arr], name, {
            type: mime,
        })
    }

    // Handle Side Effects
    useEffect(() => {
        uploadImage(image)
    }, [image, uploadImage])
    return (
        <>
            <Toaster position="top-center" richColors closeButton />
            <div className="flex gap-10 flex-wrap  w-full h-full justify-center items-center p-20">
                <div
                    onClick={onPress}
                    className={`
                cursor-pointer
                flex
                justify-center
                items-center
                flex-col
                w-[555px]
                h-[420px]
                ${image ? "p-0" : "p-20"}
                text-center
                bg-white-5
                dark:bg-dark-2
                rounded-[61px]
                outline
                outline-[#d3d3d3]
                dark:outline-[#6b6b6b]
                outline-0
                hover:outline-1
                transition-all
                overflow-hidden
            `}
                >
                    {image && image.data ? (
                        <div className="relative upload-button">
                            <img
                                src={image.data}
                                alt="Uploaded"
                                className="object-fit h-full custom-scale"
                            />
                            <div className="upload-image-button top-0 bg-[#000000ad] flex flex-col justify-center items-center absolute">
                                <div className="w-[67%]">
                                    <h1 className="text-[41px] font-[900] text-white">
                                        Choose Images
                                    </h1>
                                    <p className="text-[17px] text-[#a5a5a5]">
                                        You can click here to choose new images.
                                        Upload new images to identify diseases.
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <img
                                src="/mage_image-upload.png"
                                alt="Mage image upload logo"
                            />
                            <h1 className="text-[41px] font-[900] dark:text-white">
                                Choose Images
                            </h1>
                            <p className="text-[17px] dark:text-white-1">
                                You haven't chosen any images. Upload your
                                images to identify diseases.
                            </p>
                        </>
                    )}
                </div>
                <div
                    className={`
                    flex
                    justify-center
                    items-center
                    flex-col
                    ${image ? "w-[555px]" : "w-[0px]"}
                    h-[420px]
                    text-center
                    bg-white-5
                    dark:bg-dark-2
                    rounded-[61px]
                    overflow-hidden
                    transite-width
                    overflow-y-scroll
                `}
                >
                    {diseaseState ? (
                        <>
                            <div className="h-full w-full block p-8">
                                <h1 className="w-fit font-[900] text-[29px] dark:text-white cursor-pointer">
                                    {diseaseState.disease}&nbsp;
                                    {diseaseState.species !== "" ? (
                                        <span className="capitalize">
                                            ({diseaseState.species})
                                        </span>
                                    ) : null}
                                </h1>

                                <TabBar
                                    description={diseaseState.descriptions}
                                    treatment={diseaseState.treatments}
                                />
                            </div>
                        </>
                    ) : (
                        <Box>
                            <CircularProgress
                                size={100}
                                title="Processing your request."
                            />
                            <p className="dark:text-white mt-2">
                                Uploading your image
                                <br />
                                Please be patient
                            </p>
                        </Box>
                    )}
                </div>
            </div>
        </>
    )
}
