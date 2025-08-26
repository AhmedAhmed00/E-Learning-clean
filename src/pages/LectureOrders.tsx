import Heading from '@/components/shared/Heading'
import CustomTable from '@/components/shared/table/CustomTable'
import { BookOpen } from 'lucide-react'






export default function LectureOrders() {
  return (
    <>
  
  
    <div className="flex items-center justify-between">
                <Heading
                  titleSize="text-[25px]"
                  title="طلبات المحاضرات"
                  icon={BookOpen}
                />

   


        
    </div>
            <CustomTable
        actions={["view","delete","edit"]}
        loading={false}
        modalName="ads"
        endpoint={`ads/manage`}
        columns={[]}
        data={[]}
        
       
      />

  
  
  </>
  )
}
