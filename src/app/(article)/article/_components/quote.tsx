import {CSSProperties} from "react";
import styled from "styled-components";

interface StyleProps {
    style?: CSSProperties
}

const QuoteContainer = styled.div<StyleProps>`
  overflow: hidden; /* 隐藏超出容器的内容 */
  white-space: nowrap; /* 禁止文本换行 */
  text-overflow: ellipsis; /* 超出一行时显示省略号 */

  &:hover {
    white-space: normal; /* 允许提示内容换行 */
  }
`;

export default QuoteContainer;