import { readFileSync } from "fs"
import FormData from "form-data"

const form = new FormData()

form.append("image", readFileSync(
    __dirname.replace("dist", "src") + "/image.jpg"
), {
    contentType: "image/jpeg",
    filename: "image.jpg"
})


console.log(form.getBuffer().toString("utf-8"))