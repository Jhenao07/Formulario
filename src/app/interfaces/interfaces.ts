export interface IQuestion {
  id: number;
  text: string;
  answer?: string;
}
export interface IQuestionAnswers {
 [id: string]: string;
}
