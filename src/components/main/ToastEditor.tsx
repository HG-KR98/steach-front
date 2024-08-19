import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/toastui-editor.css';
// import {toast} from "react-toastify";

type Props = {
    editorRef: React.RefObject<Editor> | null;
    // imageHandler: (blob: File, callback: typeof Function) => void;
    content?: string;
    // onChangeFunction: (data: string) => void;
    // data: string;
};

const toolbar = [['heading', 'bold', 'italic', 'strike'], ['hr', 'quote', 'ul', 'ol'], ['image']];

// function ToastEditor({onChangeFunction, data, content, editorRef, imageHandler }: Props) {
function ToastEditor({content, editorRef}: Props) {

    return (
        <Editor
            initialValue={content ?? ' '}
            initialEditType='wysiwyg'
            autofocus={false}
            ref={editorRef}
            toolbarItems={toolbar}
            hideModeSwitch
            height='500px'
            // placeholder={data}
            // onChange={onChangeFunction}
            // hooks={{ addImageBlobHook: imageHandler }}
        />
    );
}

export default ToastEditor;