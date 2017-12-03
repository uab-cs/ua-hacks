import {RegexBlock as RegexBlock} from '../RegexBlock';
import {Quantifier} from '../Quantifier';


export class Expression extends RegexBlock {
    getType(): string { return "expression"; }

    protected groupingOverride = false;

    public groupOverride (override : boolean = false) {
        this.groupingOverride = override;
    }

    public constructor(public quantifier : Quantifier = null, public children : RegexBlock[] = []) {  super();    }

    public addChild(child : RegexBlock) {
        this.children.push(child);
    }

    public render(): string {
        let result = this.concatenate();
        return this.group(result);
    }

    /**
     * Surround input with a non-capture group,
     *  if it is multiple characters long
     * @param {string} text
     * @returns {string}
     */
    public static group(text : string) : string {
        if (Expression.isMultiChar(text)) {
            return "(?:" + text + ")";
        }
        return text;
    }

    protected shouldGroup(text : string) : boolean {
        if (this.groupingOverride) {
            return false;
        }
        let isMulti = Expression.isMultiChar(text);
        if (this.quantifier === null) {
            return isMulti && this.children.length > 1;
        }
        return isMulti;
    }

    protected concatenate() : string {
        let result = "";
        for (let child of this.children){
            result += child.render();
        }
        return result;
    }

    protected group(text : string) : string {
        if (this.shouldGroup(text)) {
            return Expression.group(text);
        }
        return text;
    }

    protected static isMultiChar(text : string) {
        return !text.match(/^(?:\\?.|\[.*\]|\(.*\))$/);
    }
}