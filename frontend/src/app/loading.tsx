import {Spinner} from "@nextui-org/react";

export default function Loading() {
    return (
        <div className="text-center w-full z-50 p-10">
            <Spinner size="lg" color="primary"/>
        </div>
    );
}
