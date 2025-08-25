"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2, PlusIcon } from "lucide-react";
import BASEURL, { apiRequest } from "@/data/api";

// ✅ Zod schema
const answerSchema = z.object({
  text: z.string().min(1, "نص الإجابة مطلوب"),
  is_correct: z.boolean(),
});

const questionSchema = z.object({
  text: z.string().min(1, "نص السؤال مطلوب"),
  answers: z.array(answerSchema).min(2, "أضف على الأقل إجابتين"),
});

const quizSchema = z.object({
  title: z.string().min(3, "عنوان الاختبار مطلوب"),
  questions: z.array(questionSchema).min(1, "أضف سؤالاً واحدًا على الأقل"),
});

type QuizFormValues = z.infer<typeof quizSchema>;

export function QuizToLecForm({ lecture_id }: { lecture_id: number }) {
  const [openModal, setOpenModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<QuizFormValues>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      title: "",
      questions: [],
    },
  });

  const {
    fields: questionFields,
    append: appendQuestion,
    remove: removeQuestion,
  } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  const handleAddQuestion = () => {
    appendQuestion({
      text: "",
      answers: [
        { text: "", is_correct: false },
        { text: "", is_correct: false },
      ],
    });
  };

  const handleAddAnswer = (questionIndex: number) => {
    const question = form.getValues(`questions.${questionIndex}`);
    const updatedAnswers = [...question.answers, { text: "", is_correct: false }];
    form.setValue(`questions.${questionIndex}.answers`, updatedAnswers);
  };

  const handleCorrectAnswer = (questionIndex: number, answerIndex: number) => {
    const answers = form.getValues(`questions.${questionIndex}.answers`);
    const updated = answers.map((a, i) => ({
      ...a,
      is_correct: i === answerIndex,
    }));
    form.setValue(`questions.${questionIndex}.answers`, updated);
  };

  const onSubmit = async (data: QuizFormValues) => {
    setIsSubmitting(true);

    try {
      // Step 1: Create quiz
      const quizRes = await apiRequest("post", `${BASEURL}/course/simple-quizzes`, {
        title: data.title,
        lecture_id,
      });

      const quiz_id = quizRes.id;

      // Step 2: For each question, create it then add its answers
      for (const question of data.questions) {
        const questionRes = await apiRequest("post", `${BASEURL}/course/simple-questions/`, {
          text: question.text,
          quiz_id,
        });

        const question_id = questionRes.id;

        for (const answer of question.answers) {
          await apiRequest("post", `${BASEURL}/course/simple-answers/`, {
            text: answer.text,
            question_id,
            is_correct: answer.is_correct,
          });
        }
      }

      form.reset();
      setOpenModal(false);
    } catch (err) {
      console.error("Error creating quiz:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog onOpenChange={setOpenModal} open={openModal}>
      <DialogTrigger asChild>
        <Button className="text-[16px] px-1">
          <PlusIcon />
          إضافة اختبار كامل
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>إضافة اختبار مع الأسئلة والإجابات</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>عنوان الاختبار</FormLabel>
                  <FormControl>
                    <Input placeholder="عنوان الاختبار" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {questionFields.map((question, qIndex) => (
              <div key={question.id} className="border p-4 rounded-md space-y-4">
                <FormField
                  control={form.control}
                  name={`questions.${qIndex}.text`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>السؤال {qIndex + 1}</FormLabel>
                      <FormControl>
                        <Input placeholder="نص السؤال" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch(`questions.${qIndex}.answers`)?.map((_, aIndex) => (
                  <FormField
                    key={aIndex}
                    control={form.control}
                    name={`questions.${qIndex}.answers.${aIndex}.text`}
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2">
                        <FormLabel className="shrink-0">إجابة {aIndex + 1}</FormLabel>
                        <FormControl>
                          <Input placeholder="نص الإجابة" {...field} />
                        </FormControl>
                        <input
                          type="radio"
                          name={`correct-${qIndex}`}
                          onChange={() => handleCorrectAnswer(qIndex, aIndex)}
                          checked={form.watch(`questions.${qIndex}.answers.${aIndex}.is_correct`)}
                        />
                        <span className="text-sm text-muted-foreground">صحيحة؟</span>
                      </FormItem>
                    )}
                  />
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleAddAnswer(qIndex)}
                  className="mt-2"
                >
                  + إضافة إجابة
                </Button>
              </div>
            ))}

            <Button type="button" variant="secondary" onClick={handleAddQuestion}>
              + إضافة سؤال
            </Button>

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  إلغاء
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    جاري إنشاء الاختبار
                  </>
                ) : (
                  "إنشاء الاختبار"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
