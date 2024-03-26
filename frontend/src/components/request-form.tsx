import SubmitButton from "@/components/submit-button";
import UrlInput from "@/components/url-input";
import MethodSelect from "@/components/method-select";
import {any} from "prop-types";

export default async function RequestForm({action, url, method}) {
    return (
        <form className="bg-neutral-200 rounded-md order-1 md:order-2" action={action}>
            <fieldset className="flex" disabled={!action}>
                <MethodSelect method={method}/>
                <UrlInput url={url}/>
                {action && <SubmitButton/>}
            </fieldset>
        </form>
    );

}
