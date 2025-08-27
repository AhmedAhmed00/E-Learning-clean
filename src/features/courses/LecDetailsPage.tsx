import { useLocation, useParams } from "react-router";
import { Video, FileText, HelpCircle, Download, Play, CheckCircle2, Trash2, Pencil, Plus, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import useUpdate from "@/hooks/useUpdate";
import BASEURL, { apiRequest, lecServices } from "@/data/api";
import { compareChanges, prepareFormData } from "@/lib/helpers";
import { useQueryClient } from "@tanstack/react-query";
import useFetchById from "@/hooks/useFetchById";

export default function LecDetailsPage() {
  const { state } = useLocation();
//   const lecture = state?.lecture;
  
  
  const {data:lecture} = useFetchById("lecture" , state?.lecture.id, lecServices.getById)
  if (!lecture) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <HelpCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">لا توجد بيانات للمحاضرة</h3>
              <p className="text-sm text-muted-foreground">
                لم يتم العثور على بيانات المحاضرة المطلوبة
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { title, videos, files, quizzes } = lecture;
const {id:courseId} = useParams()
console.log(courseId);
const queryClient = useQueryClient()
  // File Edit Dialog Component
  
  
const FileEditDialog = ({ file }) => {
  const [open, setOpen] = useState(false);
  const [filePreview, setFilePreview] = useState<{ name: string; url: string } | null>(null);
  const [existingFile, setExistingFile] = useState<{ name: string; url: string }>({
    name: file.title,
    url: file.file
  });

  const { register, handleSubmit,formState:{dirtyFields}, reset, setValue } = useForm({
    defaultValues: {
      title: file.title,
      file: null, // cannot prefill File object
    }
  });
  const { mutate: updateFile } = useUpdate({
    service: (id, body) => apiRequest("patch", `${BASEURL}/course/simple-files/${id}/`, body),
    key:"lecture",
    resourse: "file", 
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      const url = URL.createObjectURL(selectedFile);
      setFilePreview({ name: selectedFile.name, url });
      setValue("file", selectedFile);
    } else {
      setFilePreview(null);
      setValue("file", null);
    }
  };

  const onSubmit = (data) => {
    
    const newValues = compareChanges(data,dirtyFields)
    const fData = prepareFormData(newValues)
    
    
    fData.append("lecture", lecture.id)

   

    updateFile({ id: file.id, body: fData });

    reset();
    setFilePreview(null);
    // setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Pencil className="w-4 h-4" /> تعديل
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>تعديل الملف</DialogTitle>
          <DialogDescription>قم بتعديل عنوان الملف أو تحميل ملف جديد</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">عنوان الملف</Label>
            <Input
              id="title"
              {...register("title", { required: false })}
              placeholder="أدخل عنوان الملف"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="file"> ادخل ملف جديد او اترك الحالي</Label>
            <Input
              type="file"
              id="file"
              accept="application/pdf"
              onChange={handleFileChange}
            />

            {/* Show preview of new file if selected */}
            {filePreview && (
              <p className="mt-2">
                الملف المحدد:{" "}
                <a
                  href={filePreview.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  {filePreview.name}
                </a>
              </p>
            )}

            {/* Show existing file if no new file selected */}
            {!filePreview && existingFile && (
              <p className="mt-2">
                الملف الحالي:{" "}
                <a
                  href={existingFile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  {existingFile.name}
                </a>
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              إلغاء
            </Button>
            <Button type="submit">حفظ التغييرات</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  // Quiz Edit Dialog Component
const QuizEditDialog = ({ quiz }) => {
  const [open, setOpen] = useState(false);

  // Initialize react-hook-form with quiz data
  const { register, handleSubmit, reset, control } = useForm({
    defaultValues: {
      title: quiz.title,
      success_rate: quiz.success_rate,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  const { mutate: updateQuiz } = useUpdate({
    service: (id, body) =>
      apiRequest("patch", `${BASEURL}/course/simple-questions/${id}/`, body),
    key: "lecture",
    resourse: "file",
  });

  const onSubmit = (data) => {
    // Transform answers into expected format if necessary
  

    const body = {
      id: quiz.id,
      title: data.title,
      success_rate: Number(data.success_rate),
    //   questions: updatedQuestions,
    };

    updateQuiz({ id: quiz.id, body });
    setOpen(false);
    reset();
  };

  return (
    <Dialog  open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Pencil className="w-4 h-4" />
          تعديل الاختبار
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>تعديل الاختبار</DialogTitle>
          <DialogDescription>قم بتعديل بيانات الاختبار والأسئلة</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Quiz Metadata */}
          <div className="space-y-2">
            <Label htmlFor="quiz-title">عنوان الاختبار</Label>
            <Input
              id="quiz-title"
              {...register("title", { required: true })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="success-rate">نسبة النجاح (%)</Label>
            <Input
              id="success-rate"
              type="number"
              min={0}
              max={100}
              {...register("success_rate", { required: true })}
            />
          </div>

          {/* Questions */}
          {/* <div className="space-y-4">
            {fields.map((question, qIndex) => (
              <div key={question.id} className="border p-4 rounded space-y-2">
                <div className="flex justify-between items-center">
                  <h4>سؤال {qIndex + 1}</h4>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => remove(qIndex)}
                  >
                    حذف
                  </Button>
                </div>

                <Input
                  placeholder="نص السؤال"
                  {...register(`questions.${qIndex}.text`, { required: true })}
                />

                <Input
                  placeholder="درجة السؤال"
                  type="number"
                  {...register(`questions.${qIndex}.grade`, { required: true })}
                />

                <Select {...register(`questions.${qIndex}.question_type`)}>
                  <option value="mcq">MCQ</option>
                  <option value="tof">True/False</option>
                </Select> */}

                {/* Answers */}
                {/* <div className="space-y-1">
                  {question.answers?.map((answer, aIndex) => (
                    <div key={aIndex} className="flex items-center space-x-2">
                      <Input
                        placeholder="نص الإجابة"
                        {...register(
                          `questions.${qIndex}.answers.${aIndex}.text`,
                          { required: true }
                        )}
                      />
                      <label className="flex items-center space-x-1">
                        صحيح؟
                        <input
                          type="checkbox"
                          {...register(
                            `questions.${qIndex}.answers.${aIndex}.is_correct`
                          )}
                        />
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))} */}
          {/* </div> */}

          {/* <Button
            type="button"
            onClick={() =>
              append({
                text: "",
                grade: 1,
                question_type: "mcq",
                answers: [
                  { text: "", is_correct: false },
                  { text: "", is_correct: false },
                ],
              })
            }
          >
            إضافة سؤال جديد
          </Button> */}

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              إلغاء
            </Button>
            <Button type="submit">حفظ التغييرات</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

  // Question Edit Dialo`g Component
const QuestionEditDialog = ({ question, quizId }) => {
  const [open, setOpen] = useState(false);

  const { mutate: updateQuizQuestion } = useUpdate({
    service: (id, body) =>
      apiRequest("patch", `${BASEURL}/course/simple-questions/${question.id}/`, body),
    key: "lecture",
    resourse: "question",
  });

  const { register, handleSubmit, control, watch, reset } = useForm({
    defaultValues: {
      text: question.text,
      question_type: question.question_type || "mcq",
      grade: question.grade,
      answers: question.answers || [],
    },
  });

  const { fields, append, remove, update, replace } = useFieldArray({
    control,
    name: "answers",
  });

  const watchQuestionType = watch("question_type");

  // Whenever the question type changes to TOF, replace answers with True/False
  useEffect(() => {
    if (watchQuestionType === "tof") {
      replace([
        { text: "True", is_correct: true },
        { text: "False", is_correct: false },
      ]);
    }
  }, [watchQuestionType, replace]);

  const onSubmit = (data) => {
    const body = {
      quiz: quizId,
      text: data.text,
      question_type: data.question_type,
      grade: parseInt(data.grade),
      answers: data.answers.map((answer) => ({
        text: answer.text,
        is_correct: answer.is_correct,
      })),
    };

    updateQuizQuestion({ id: quizId, body });
    setOpen(false);
    reset();
  };

  const addAnswer = () => {
    if (watchQuestionType === "tof") return; // no extra answers for TOF
    append({ text: "", is_correct: false });
  };

  const handleSingleCheck = (index) => {
    if (watchQuestionType === "tof") {
      update(0, { text: "True", is_correct: index === 0 });
      update(1, { text: "False", is_correct: index === 1 });
      return;
    }
    // For MCQ, only one correct answer
    fields.forEach((_, i) => {
      update(i, { ...fields[i], is_correct: i === index });
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Pencil className="w-4 h-4" /> تعديل السؤال
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>تعديل السؤال</DialogTitle>
          <DialogDescription>قم بتعديل السؤال والإجابات</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="question-text">نص السؤال</Label>
            <Textarea
              id="question-text"
              {...register("text")}
              placeholder="أدخل نص السؤال"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="question-type">نوع السؤال</Label>
            <Controller
              name="question_type"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر نوع السؤال" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mcq">اختيار متعدد (MCQ)</SelectItem>
                    <SelectItem value="tof">صح أو خطأ (True/False)</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="grade">الدرجة</Label>
            <Input
              id="grade"
              type="number"
              min="1"
              {...register("grade")}
              placeholder="أدخل درجة السؤال"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>الإجابات</Label>
              {watchQuestionType === "mcq" && (
                <Button type="button" variant="outline" size="sm" onClick={addAnswer}>
                  <Plus className="w-4 h-4 mr-2" /> إضافة إجابة
                </Button>
              )}
            </div>

            <div className="space-y-3">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex items-center space-x-2 p-3 border rounded-lg"
                >
                  <Controller
                    name={`answers.${index}.is_correct`}
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={() => handleSingleCheck(index)}
                      />
                    )}
                  />
                  <div className="flex-1">
                    <Input
                      {...register(`answers.${index}.text`)}
                      placeholder="نص الإجابة"
                      disabled={watchQuestionType === "tof"}
                    />
                  </div>
                  {watchQuestionType === "mcq" && fields.length > 2 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => remove(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              إلغاء
            </Button>
            <Button type="submit">حفظ التغييرات</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};


  // Answer Edit Dialog Component
  const AnswerEditDialog = ({ answer, questionId }) => {
    const [open, setOpen] = useState(false);
    const { register, handleSubmit, control, reset } = useForm({
      defaultValues: {
        text: answer.text,
        is_correct: answer.is_correct
      }
    });
    
    
      const { mutate: updateAnswer } = useUpdate({ service: (id, body) => apiRequest("patch", 
        `${BASEURL}/course/simple-answers/${answer.id}/`,
         body), key: "lecture", resourse: "answer", });

    const onSubmit = (data) => {
      const body = {
        question: questionId,
        text: data.text,
        is_correct: data.is_correct
      };
      console.log(updateAnswer({id:1,body:body}), );
      setOpen(false);
      reset();
    };

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <Pencil className="w-3 h-3" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>تعديل الإجابة</DialogTitle>
            <DialogDescription>
              قم بتعديل نص الإجابة وحالة الصحة
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="answer-text">نص الإجابة</Label>
              <Input
                id="answer-text"
                {...register("text", { required: true })}
                placeholder="أدخل نص الإجابة"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Controller
                name="is_correct"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="is-correct"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label htmlFor="is-correct">إجابة صحيحة</Label>
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                إلغاء
              </Button>
              <Button type="submit">
                حفظ التغييرات
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="container mx-auto p-6 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">{title}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {videos?.length > 0 && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Video className="w-3 h-3" />
                {videos.length} فيديو
              </Badge>
            )}
            {files?.length > 0 && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <FileText className="w-3 h-3" />
                {files.length} ملف
              </Badge>
            )}
            {quizzes?.length > 0 && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <HelpCircle className="w-3 h-3" />
                {quizzes.length} اختبار
              </Badge>
            )}
          </div>
        </div>

        <div className="space-y-8">
          {/* Videos Section */}
          {videos && videos.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-right">
                  <Video className="w-5 h-5 text-blue-600" />
                  الفيديوهات
                </CardTitle>
                <CardDescription className="text-right">
                  مشاهدة فيديوهات المحاضرة والمحتوى التعليمي
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  {videos.map((vid, index) => (
                    <Card key={vid.id} className="border-l-4 border-l-blue-500">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{vid.title}</CardTitle>
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Play className="w-3 h-3" />
                            فيديو {index + 1}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="aspect-video rounded-lg overflow-hidden bg-black">
                          <video controls className="w-full h-full">
                            <source src={vid.video} type="video/mp4" />
                            متصفحك لا يدعم تشغيل الفيديو
                          </video>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Files Section */}
          {files && files.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-right">
                  <FileText className="w-5 h-5 text-green-600" />
                  الملفات والمواد التعليمية
                </CardTitle>
                <CardDescription className="text-right">
                  تحميل الملفات والمراجع المرتبطة بالمحاضرة
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {files.map((file, index) => (
                    <div key={file.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-green-100">
                          <FileText className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{file.title}</p>
                          <p className="text-sm text-muted-foreground">ملف رقم {index + 1}</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2"> 
                        <Button asChild variant="outline" size="sm">
                          <a
                            href={file.file}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2"
                          >
                            <Download className="w-4 h-4" />
                            تحميل
                          </a>
                        </Button>
                        <FileEditDialog file={file} />
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-4 h-4" />
                          حذف
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quizzes Section */}
          {quizzes && quizzes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-right">
                  <HelpCircle className="w-5 h-5 text-purple-600" />
                  الاختبارات والتقييمات
                </CardTitle>
                <CardDescription className="text-right">
                  اختبارات لقياس فهمك للمحتوى التعليمي
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {quizzes.map((quiz, quizIndex) => (
                    <Card key={quiz.id} className="border-l-4 border-l-purple-500">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-xl">{quiz.title}</CardTitle>
                          
                          <div className="flex gap-2 items-center">
                            <Badge variant="secondary" className="flex items-center gap-1">
                              <HelpCircle className="w-3 h-3" />
                              {quiz.questions.length} سؤال
                            </Badge>
                            <Badge variant="secondary" className="flex items-center gap-1">
                              <HelpCircle className="w-3 h-3" />
                              {quiz.success_rate}% نسبة النجاح
                            </Badge>
                            <QuizEditDialog quiz={quiz} />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          {quiz.questions.map((q, questionIndex) => (
                            <div key={q.id} className="space-y-3">
                              <div className="flex items-start gap-3">
                                <Badge variant="outline" className="mt-1">
                                  {questionIndex + 1}
                                </Badge>
                                <p className="font-medium text-foreground leading-relaxed flex-1">{q.text}</p>
                                <p className="font-medium bg-slate-400 text-white text-sm px-2 rounded-md leading-relaxed">
                                  {q.grade} درجات
                                </p>
                                <QuestionEditDialog question={q} quizId={quiz.id} />
                              </div>
                              
                              <div className="mr-8 space-y-2">
                                {q.answers.map((ans, answerIndex) => (
                                  <div
                                    key={ans.id}
                                    className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                                      ans.is_correct
                                        ? "bg-green-50 border-green-200 text-green-800"
                                        : "bg-gray-50 border-gray-200"
                                    }`}
                                  >
                                    <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${
                                      ans.is_correct
                                        ? "bg-green-100 text-green-600"
                                        : "bg-gray-100 text-gray-600"
                                    }`}>
                                      {String.fromCharCode(97 + answerIndex)}
                                    </div>
                                    <span className={`flex-1 ${ans.is_correct ? "font-medium" : ""}`}>
                                      {ans.text}
                                    </span>
                                    {ans.is_correct && (
                                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                                    )}
                                    <AnswerEditDialog answer={ans} questionId={q.id} />
                                  </div>
                                ))}
                              </div>
                              
                              {questionIndex < quiz.questions.length - 1 && (
                                <Separator className="my-4" />
                              )}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}