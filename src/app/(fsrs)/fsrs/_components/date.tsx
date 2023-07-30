import {CSSProperties} from "react";
import dayjs, {ConfigType} from "dayjs";
// import 'dayjs/locale/en'
// import 'dayjs/locale/zh'
// import 'dayjs/locale/ja'

export default function Date({
                                 date,
                                 format = "YYYY/MM/DD HH:mm:ss",
                                 style,
                                 inline = false
                             }: { date: ConfigType, style?: CSSProperties, inline?: boolean, format?: string }) {
    const dayjs_ = dayjs(date)
    return <time dateTime={dayjs_.format("YYYY-MM-DDThh:mm:ssTZD")} style={{
        display: inline ? 'inline' : 'block',
        ...style
    }}>
        {dayjs_.format(format)}
    </time>;
}