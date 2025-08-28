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
import { Textarea } from "@/components/ui/textarea";
import { Loader2, PlusIcon } from "lucide-react";
import BASEURL, { apiRequest } from "@/data/api";
import { useNavigate, useParams } from "react-router";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

// ✅ Zod schema
const answerSchema = z.object({
  text: z.string().min(1, "نص الإجابة مطلوب"),
  is_correct: z.boolean(),
});

const questionSchema = z.object({
  text: z.string().min(1, "نص السؤال مطلوب"),
  question_type: z.enum(["mcq", "tof"], {
    required_error: "حدد نوع السؤال",
  }),
  answers: z.array(answerSchema).min(2, "أضف على الأقل إجابتين"),
});

const quizSchema = z.object({
  title: z.string().min(3, "عنوان الاختبار مطلوب"),
  description: z.string().min(5, "الوصف مطلوب"),
  success_rate: z.coerce.number().min(1).max(100),
  questions: z.array(questionSchema).min(1, "أضف سؤالاً واحدًا على الأقل"),
});

type QuizFormValues = z.infer<typeof quizSchema>;

export function QuizToLecForm() {
  const {lectureId:lecture_id} = useParams()
  const [openModal, setOpenModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate()

  const form = useForm<QuizFormValues>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      title: "",
      description: "",
      success_rate: 70,
      questions: [],
    },
  });
console.log(lecture_id,"lecture_id");
  const {
    fields: questionFields,
    append: appendQuestion,
  } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  const handleAddQuestion = () => {
    appendQuestion({
      text: "",
      question_type: "mcq",
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
  
  const queryClient = useQueryClient()

  const onSubmit = async (data: QuizFormValues) => {
    setIsSubmitting(true);

    try {
      const payload = {
        lecture: lecture_id,
        title: data.title,
        description: data.description,
        success_rate: data.success_rate,
        questions: data.questions.map((q) => ({
          text: q.text,
          question_type: q.question_type,
          answers: q.answers,
        })),
      };

      console.log("Submitting payload:", payload);

      await apiRequest("post", `${BASEURL}/course/simple-quizzes/`, payload);

      form.reset();
      toast.success("تم إضافة الإختبار بنجاح")
queryClient.invalidateQueries({ queryKey: ["courses"] });
      navigate(`/course/lec/${lecture_id}`)
      setOpenModal(false);
    } catch (err) {
            toast.error("حدث خطأ, تأكد من ان البيانات صحيحة")

      console.error("Error creating quiz:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
 

        <Form  {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-white p-8 rounded-2xl shadow-lg mt-8">
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

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الوصف</FormLabel>
                  <FormControl>
                    <Textarea placeholder="وصف الاختبار" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="success_rate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>نسبة النجاح (%)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="مثال: 70" {...field} />
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

                <FormField
                  control={form.control}
                  name={`questions.${qIndex}.question_type`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>نوع السؤال</FormLabel>
                      <select {...field} className="border rounded px-2 py-1">
                        <option value="mcq">اختيار من متعدد</option>
                        <option value="tof">صح / خطأ</option>
                      </select>
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
<div className="mt-5 flex gap-3 "> 
    <Button onClick={()=> navigate(-1)} type="button" variant="outline">
                  إلغاء
                </Button>
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
</div>
       
              
      
          </form>
        </Form>
   
  );
}
