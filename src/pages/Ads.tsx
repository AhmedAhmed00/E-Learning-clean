import { AdForm } from "@/components/forms/AdForm";
import { CourseForm } from "@/components/forms/CourseForm";
import Heading from "@/components/shared/Heading";
import CustomTable from "@/components/shared/table/CustomTable";
import { adsServices } from "@/data/api";
import { useFetch } from "@/hooks/useFetch";
import { BookOpen } from "lucide-react";



const adsCols = [
  { label: "id", key: "id" },
  { label: "الإسم", key: "name" },
  {
    label: "الصورة",
    key: "image",
    render: (imageUrl: string) => (<div className= "ms-10 bg-red-900 rounded-2xl w-32 justify-self-center  h-22"> 
 <img
        src={imageUrl}
        alt="صورة"
        className=" object-cover w-full h-full rounded-2xl"
      />
    </div>
     
    )
  },
  {
    label: "الحالة",
    key: "user_is_active",
    render: (value: boolean) => (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${
          value ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        }`}
      >
        {value ? "نشط" : "غير نشط"}
      </span>
    )
  }
];



export default function Ads() {

  const {data} = useFetch({ 
    service:adsServices.getAll,
    key:"ads"
  })


  console.log(data)



  return (<>
  
  
    <div className="flex items-center justify-between">
                <Heading
                  titleSize="text-[25px]"
                  title="إدارة الإعلانات"
                  desc="إدارة وتنظيم جميع الإعلانات التعليمية"
                  icon={BookOpen}
                />
             <AdForm />

   


        
    </div>
            <CustomTable
        actions={["view","delete","edit"]}
        loading={false}
        modalName="ads"
        endpoint={`employee/ads`}
        columns={adsCols}
        data={data?.results ?? []}

      />

  
  
  </>
  )
}
