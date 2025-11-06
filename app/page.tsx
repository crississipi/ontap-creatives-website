import { Mainpage } from "@/components";
export default function Home() {
  const editable = false;

  return (
    <main className='min-h-[100vh] h-auto w-full flex flex-col items-center relative overflow-x-hidden p-0 m-0 select-none'>
      <Mainpage editable={editable} />
    </main>
    
  );
}
