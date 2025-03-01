import React , {useState , useEffect} from 'react'
import axios from 'axios'

function MainPage() {
  //states for the form feilds
  const [date,setDate] = useState(null);
  const [sourceCurrency, setSourceCurrency] = useState("");
  const [targetCurrency, setTargetCurrency] = useState("");
  const [amountInSourceCurrency,setAmountInSourceCurrency] = useState(0);
  const [amountInTargetCurrency,setAmountInTargetCurrency] = useState(0);
  const [currencyNames, setcurrencyNames] = useState([]);
  const [loading, setLoading] = useState(false);
  const[textloading,setTextLoading]=useState(true); 


    //get all the currencies
    useEffect(() => {
      const getTheCurrencies = async () => {
        try {
          const responce = await axios.get(
            "http://localhost:5000/getAllCurrencies"
          );
          setcurrencyNames(responce.data);
        } catch (err) {
          console.error(err);
        }
      };
      getTheCurrencies();
    }, []);

  //handlesubmit method
  const handleSubmit = async (e) => {
     e.preventDefault();
     setLoading(true); 
     console.log(date,sourceCurrency,targetCurrency,amountInSourceCurrency);

     try{

      const responce = await axios.get("http://localhost:5000/convert",{
           params:{
            date,
            sourceCurrency,
            targetCurrency,
            amountInSourceCurrency,
           }
      })

  
      setAmountInTargetCurrency(responce.data.amountInTargetCurrency)
      console.log('Ammout in targer currency  : ' , amountInTargetCurrency)
      setTextLoading(false)

     }catch (e) {
      console.log("error : ", e)

     }finally {
      setLoading(false); // Hide loading screen
    }
  };


  
  return (

    <div>
      {loading?(        
      <div className="w-full h-screen flex flex-col items-center justify-center bg-black">
      <div className="w-16 h-16 border-4 border-green-500 border-dashed rounded-full animate-spin"></div>
      <p className="mt-4 text-green-600 font-semibold text-xl">Converting...</p>
    </div>
      ):(  
      <div className="bg-cover bg-center h-screen w-full" style={{ backgroundImage: "url('currency-banner.jpg')" }}>
        <div>
        <br></br> <br></br>
        <h1 className='lg:mx-32  text-5xl font-bold text-green-500 text-center'> Convert Your Currencies Today!</h1>
        <p className='lg:mx-32 opacity-80 py-6 text-center'>Convert Your Currencies Today is your ultimate currency exchange companion! Whether you're traveling the world, 
            shopping internationally, managing business transactions, or sending money abroad, our app ensures quick, accurate, 
            and hassle-free conversions in real-time.</p>
        </div>
       
       <div className="mt-5 flex items-center justify-center flex-col">
           <section className="w-full lg:w-1/2">
             <form onSubmit={handleSubmit}>
              
                      <div className="mb-4">
                       <label htmlFor={date} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Date</label>
                       <input onChange={(e) => setDate(e.target.value)} type="Date" id={date} name={date} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-white-100 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-green-500 dark:focus:border-green-500"  required />
    
                      </div>


                      <div className="mb-4">
                       <label htmlFor={sourceCurrency} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Source Currency
                       </label>
                       <select
                       onChange={(e) => setSourceCurrency(e.target.value)}
                       className= "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-white-100 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-green-500 dark:focus:border-green-500" name={sourceCurrency} id={sourceCurrency} value={sourceCurrency}>

                           <option value=""> Select Your Source Currency</option>
                           {console.log("currency names : ",currencyNames)}
                           {Object.keys(currencyNames).map((currency) => (
                          <option className=" p-1" key={currency} value={currency}>
                          {currencyNames[currency]}
                         </option>
                ))}


                       </select>
                      </div>

                      <div className="mb-4">
                       <label htmlFor={targetCurrency} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Target Currency
                       </label>
                       <select
                       onChange={(e) => setTargetCurrency(e.target.value)}
                       className= "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-white-100 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-green-500 dark:focus:border-green-500" name={targetCurrency} id={targetCurrency} value={targetCurrency}>

                           <option value=""> Select Your Target Currency</option> 
                           {Object.keys(currencyNames).map((currency) => (
                           <option className=" p-1" key={currency} value={currency}>
                          {currencyNames[currency]}
                          </option>
                          ))}
                        

                       </select>  
                      </div>


                      <div className="mb-4">
                       <label htmlFor={amountInSourceCurrency} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Amount in Source Currency</label>
                       <input onChange={(e)=>setAmountInSourceCurrency(e.target.value)} type="number" id={amountInSourceCurrency} name={amountInSourceCurrency} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-white-100 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-green-500 dark:focus:border-green-500" placeholder='Amount in Source Currency' required />

                      <br></br>
                      </div>

                     <button  className='bg-green-500 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md'>
                      {""}
                       Get Target Currency
                    </button> 
                    

                    {!textloading ?  <section className='lg:mx-32  text-xl text-center '>
                    <br></br>
                    <p>  {amountInSourceCurrency} {currencyNames[sourceCurrency] } is equals to {""}<span className='text-green-500 font-bold' >{amountInTargetCurrency}</span> in {currencyNames[targetCurrency]}</p>
                    </section> : null}
                   
                    
          

             </form>
             


           </section>
       </div>


    </div>)}

    
    </div>
 
  
  )
}

export default MainPage