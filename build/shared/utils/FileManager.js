var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ProjectConfig } from "./ProjectConfig.js";
export class FileManager extends EventTarget {
    constructor() {
        super();
        this.input = document.createElement("input");
        this.projectConfig = ProjectConfig.getInstance();
        this.input.type = "file";
    }
    static getInstance() {
        if (!FileManager.instance) {
            FileManager.instance = new FileManager();
        }
        return FileManager.instance;
    }
    openFiles(contentType = FileManager.CONTENT_TYPE_IMAGES, multiple = false) {
        const input = this.input;
        contentType ? input.accept = contentType : input.removeAttribute("accept");
        input.multiple = multiple;
        return new Promise(resolve => {
            input.onchange = () => {
                let files = input.files ? Array.from(input.files) : [];
                input.onchange = null;
                resolve(files);
            };
            input.click();
        });
    }
    openProject() {
        return __awaiter(this, void 0, void 0, function* () {
            const [fileHandle] = yield window.showOpenFilePicker({
                types: [{
                        description: "Animator file",
                        accept: { 'text/plain': [this.projectConfig.fileExt] }
                    }],
                excludeAcceptAllOption: true,
                multiple: false,
            });
            this.projectFile = fileHandle;
            return yield fileHandle.getFile();
        });
    }
    saveProject() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.projectFile) {
                if ((yield this.projectFile.queryPermission()) === "granted") {
                    const writable = yield this.projectFile.createWritable();
                    yield writable.write(this.projectConfig.toJSONString());
                    yield writable.close();
                }
            }
        });
    }
    saveProjectAs() {
        return __awaiter(this, void 0, void 0, function* () {
            const filename = this.projectConfig.projectName;
            const fileExt = this.projectConfig.fileExt;
            if (window.showSaveFilePicker) {
                const options = {
                    suggestedName: filename,
                    types: [{
                            description: "Animator file",
                            accept: { 'text/plain': [fileExt] },
                        }]
                };
                const saveFile = this.projectFile = yield window.showSaveFilePicker(options);
                this.projectConfig.projectName = saveFile.name.slice(0, -(fileExt.length));
                yield this.saveProject();
            }
        });
    }
    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = this.initFileReader(resolve, reject);
            reader.readAsDataURL(file);
        });
    }
    fileToText(file) {
        return new Promise((resolve, reject) => {
            const reader = this.initFileReader(resolve, reject);
            reader.readAsText(file);
        });
    }
    initFileReader(resolve, reject) {
        const fileReader = new FileReader();
        fileReader.onload = (event) => {
            if (typeof fileReader.result === "string") {
                resolve(fileReader.result);
            }
            //todo: process else
        };
        fileReader.onerror = (error) => {
            reject(error);
        };
        fileReader.onloadend = (event) => {
            fileReader.onloadend = null;
            fileReader.onload = null;
            fileReader.onerror = null;
        };
        return fileReader;
    }
}
FileManager.CONTENT_TYPE_IMAGES = "image/*";
//# sourceMappingURL=FileManager.js.map