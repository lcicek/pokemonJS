export class Dialogue {
    constructor() {
        this.maxCharsPerLine = 42
        this.textBlock = []
    }

    setText(text) {
        this.currentLine = 0
        this.formattedText = this.format(text)
        this.totalLines = this.formattedText.length
    }

    nextBlock() {
        this.currentLine += 2
    }

    getCurrentBlock() { // TODO: make more robust, less susceptible to bad usage
        let textBlock = []

        if (this.currentLine < this.totalLines) textBlock.push(this.formattedText[this.currentLine])
        if (this.currentLine+1 < this.totalLines) textBlock.push(this.formattedText[this.currentLine+1])

        return textBlock
    }

    isLastBlock() {
        return this.currentLine + 2 >= this.totalLines
    }

    format(text) { // TODO: handle case where a single word exceeds the character limit per line
        let formattedText = []
        let startIndex = 0
        let endIndex = this.maxCharsPerLine - 1

        while(startIndex < text.length) {
            while(startIndex < text.length && this.isSpace(text[startIndex])) {
                startIndex++;
                endIndex++;
            } 

            if (endIndex >= text.length) endIndex = text.length - 1
            else while(this.isLetter(text[endIndex]) && !this.isLastLetterInWord(endIndex, text)) endIndex--;
                
            formattedText.push(text.substring(startIndex, endIndex+1))

            startIndex = endIndex+1
            endIndex = startIndex + this.maxCharsPerLine - 1
        }

        return formattedText
    }
    
    isLastLetterInWord(endIndex, text) {
        return this.isSpace(text[endIndex+1])
    }

    isSpace(char) {
        return char == ' '
    }

    isLetter(char) {
        return !this.isDelimiter(char)
    }

    isDelimiter(char) {
        return char == '.' || char == ' ' || char == '?' || char == ':' || char == ';'
    }

    getFormattedText() {
        return this.formattedText
    }
}