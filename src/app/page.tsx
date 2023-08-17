import Header from "./header";

export default function Home() {
  return (
    <>
    <Header/>
    <main className="block min-h-screen items-center justify-between my-4" >
      <div className="border-white md:w-1/2 m-auto">

        
        

      </div>

      
      <form className='flex left-2 w-full fixed bottom-3 text-center justify-center'>
        <textarea className='text-slate-50 left-4 md:w-5/12 resize-none bg-slate-600 rounded-xl outline-none p-4 h-14' placeholder="Send a message "/>
      <button disabled className="text-slate-50 mx-3 px-20 border-2 disabled:bg-stone-500 enabled:bg-green-900 max-md:px-1 rounded-lg h-14">Submit</button>
      </form>
      
      
      
      
    </main>
    </>
  )
};

