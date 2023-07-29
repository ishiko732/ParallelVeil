import {language} from "@/types/language";

export function Context(props: { title: string, language: language, context: string }) {
    return <div>
        {props.context}
    </div>
}