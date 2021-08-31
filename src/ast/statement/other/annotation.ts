import { Statement, STATEMENT_KIND } from "../statement";

export type AnnotationKind = 'LINE' | 'BLOCK';
export class Annotation extends Statement {
  static isAnnotation(object: any): object is Annotation {
    return Statement.isStatement(object) && object.$kind === STATEMENT_KIND.ANNOTATION;
  }
  $kind: STATEMENT_KIND.ANNOTATION = STATEMENT_KIND.ANNOTATION;
  $style: AnnotationKind;
  $text: string;

  constructor(kind: AnnotationKind, text: string) {
    super();

    this.$style = kind;
    this.$text = text;
  }
}
