'use client'

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Typewriter from "typewriter-effect";
import Chart from './components/Chart';
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter();
  const [isTopPage, setIsTopPage] = useState(true);

  useEffect(() => {
    function handleScroll() {
      const scrollTop = window.scrollY;
      setIsTopPage(scrollTop < 150);
    }

    // Add event listener when component mounts
    window.addEventListener('scroll', handleScroll);

    // Clean up event listener when component unmounts
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  function scrollDown() {
    const scrollTarget = window.innerHeight;

    // Smoothly scroll to the target position
    window.scroll({
      top: scrollTarget,
      behavior: 'smooth'
    });
  }
  
  const goToLogin = () => {
    router.push('/login');
  }

  const dummyPriceData = [
    { date: "2024-05-01", id: 1, price: "50.95", product_id: 123 },
    { date: "2024-05-08", id: 2, price: "30", product_id: 123 },
    { date: "2024-05-15", id: 3, price: "45.99", product_id: 123 },
    { date: "2024-05-22", id: 4, price: "50", product_id: 123 },
    { date: "2024-05-29", id: 5, price: "40", product_id: 123 },
  ];
  
  return (
    <main>
      <div className='lg:min-h-screen w-full'>
        {/* title */}
        <h1 id='main-text' className='lg:text-6xl text-4xl text-center py-20 font-semibold drop-shadow-glow'>Track product prices<br></br> using <span className='text-[#0daaf9]'>a URL</span> from
            <Typewriter
              onInit={(typewriter) => {
                  typewriter
                      .typeString("Bol.com")
                      .pauseFor(300)
                      .deleteAll()
                      .typeString("Coolblue.nl")
                      .pauseFor(300)
                      .deleteAll()
                      .typeString("Zalando.nl")
                      .pauseFor(300)
                      .deleteAll()
                      .typeString("Jumbo.com")
                      .pauseFor(300)
                      .deleteAll()
                      .typeString("Wehkamp.nl")
                      .pauseFor(300)
                      .deleteAll()
                      .typeString("Apple.com")
                      .pauseFor(300)
                      .deleteAll()
                      .typeString("Ikea.com")
                      .pauseFor(300)
                      .deleteAll()
                      .typeString("Lunajoyboutique.com")
                      .pauseFor(300)
                      .start();
              }}
            />
        </h1>
        <div className='w-full flex justify-center'>
            <Link href='/login' className='p-4 bg-[#0daaf9] rounded-lg hover:bg-[#0daaf9af]'>Start tracking</Link>
        </div>
        
            
        {/* 3 squares */}
        <div className='flex lg:flex-row flex-col justify-evenly items-center gap-5 pt-16 z-50 pb-10 lg:pb-0'>
          <div className='rounded-xl bg-gradient-to-r from-[#8cc9e8] via-[#8cc9e8] to-[#0DAAF9] lg:w-1/4 w-3/4'>
            <div className='m-1 p-5 rounded-xl min-h-60 hover:drop-shadow-box duration-150 bg-center bg-cover' style={{ backgroundImage: "url('/assets/images/startup-culture.png')" }}>
              <h2 className='text-2xl'>Search Products</h2>
            </div>
          </div>
          <div className='rounded-xl bg-gradient-to-r from-[#8cc9e8] via-[#8cc9e8] to-[#0DAAF9] lg:w-1/4 w-3/4'>
            <div className='m-1 p-5 bg-[#040A0D] rounded-xl min-h-60 hover:drop-shadow-box duration-150 bg-center bg-cover' style={{ backgroundImage: "url('/assets/images/email-icon-or-letter-envelope.png')" }}>
              <h2 className='text-2xl'>Get notified on price change</h2>
            </div>
          </div>
          <div className='rounded-xl bg-gradient-to-r from-[#8cc9e8] via-[#8cc9e8] to-[#0DAAF9] lg:w-1/4 w-3/4'>
            <div className='m-1 p-5 bg-[#040A0D] rounded-xl min-h-60 hover:drop-shadow-box duration-150 bg-center' style={{ backgroundImage: "url('/assets/images/line-graph.png')" }}>
              <h2 className='text-2xl'>Track product prices</h2>
            </div>
          </div>
        </div>
      </div>

      <div className='w-full bg-[#0daaf9] py-24'>
          <h1 className='lg:text-6xl text-4xl text-center pb-20 lg:pt-0 font-semibold'>How does it work?</h1>
          <div className='w-full flex justify-center text-xl'>
              {/* input */}
              {/* <div className='relative flex w-full justify-center'>
                <div className=' bg-white border border-white rounded-full lg:w-1/2 relative'>
                  <input type='text' placeholder='Product URL' className='p-3 bg-white border border-white rounded-full w-full outline-none text-black relative'></input>
                  <i className="bi bi-search text-3xl text-black absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"></i>
                </div>
              </div> */}
              <div className='flex gap-5 lg:flex-row flex-col text-center'>
                  <div className='flex-col gap-3'>
                      <div className='w-full flex justify-center'>
                          <i className="bi bi-link-45deg text-4xl"></i>
                      </div>
                      <p>Put in a product URL</p>
                  </div>
                  <svg fill="blue" className='w-11 h-11 lg:rotate-45 lg:flex hidden' version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200.013 200.013" stroke="#000000" strokeWidth="0.00200013" transform="rotate(45)"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M197.007,48.479L139.348,0v28.623C63.505,32.538,3.006,95.472,3.006,172.271v27.741h40.099v-27.741 c0-54.682,42.527-99.614,96.243-103.47v28.156L197.007,48.479z"></path> </g></svg>
                  <div className='flex-col gap-3'>
                      <div className='w-full flex justify-center'>
                          <i className="bi bi-graph-down-arrow text-3xl"></i>
                      </div>
                      <p>Track pricing</p>
                  </div>
                  <svg fill="blue" className='w-11 h-11 lg:flex hidden mt-12' version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200.013 200.013" stroke="#000000" strokeWidth="0.00200013" transform="rotate(-45)matrix(1, 0, 0, -1, 0, 0)"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M197.007,48.479L139.348,0v28.623C63.505,32.538,3.006,95.472,3.006,172.271v27.741h40.099v-27.741 c0-54.682,42.527-99.614,96.243-103.47v28.156L197.007,48.479z"></path> </g></svg>
                  <div className='flex-col gap-3'>
                      <div className='w-full flex justify-center'>
                          <i className="bi bi-bell-fill text-3xl"></i>
                      </div>
                      <p>Get notified with an email</p>
                  </div>
              </div>
          </div>
      </div>

      <div className='w-full py-24'>
          <h1 className='lg:text-6xl text-4xl text-center pt-20 pb-4 lg:pt-0 font-semibold'>Never miss any <span className='bg-green-500 rounded-lg p-1'>sales</span> again</h1>
          <p className='text-center font-light mb-12 w-4/5 mx-auto'>PriceTracker delivers real-time price tracking and alerts to ensure you never miss out on a deal again.</p>
          <div className='w-full flex flex-col justify-center items-center text-xl'>
              <div className="lg:w-1/3 w-4/5 relative text-xl h-14 flex justify-center items-center mb-12">
                    <input type="text" value={'https://www.vqfit.com/products/vanquish-dbz-cs-trunks-black-oversized...'} readOnly placeholder="Product URL.." className="h-full px-5 rounded-full bg-white text-black w-full"/>
                    <div className="absolute right-0 text-4xl w-20 h-14 text-black cursor-pointer bg-[#0daaf9] flex justify-center items-center rounded-r-full">
                        <i className="bi bi-search"></i>
                    </div>
              </div>

            <div className='w-full flex lg:flex-row flex-col justify-center gap-5'>
                <div className="lg:w-80 w-4/5 bg-[#0B1318] rounded-lg text-left mx-auto lg:mx-0">
                  <img className='rounded-lg' src='https://www.vqfit.com/cdn/shop/files/FIRSTSHOT_2784baaa-dbe6-4700-a587-0200b52a5718.jpg?v=1711252628&width=700' />
                  <div className="p-5"><p className="text-xl min-h-14">vanquish dbz cs trunks black oversized t shirt - <span className="text-[#0daaf9]">€50,95</span></p>
                      <button onClick={goToLogin} className="p-3 bg-[#0daaf9] text-white mt-5 rounded-lg">Track Product</button>
                  </div>
                </div>
                <div className='lg:max-w-[800px] w-4/5 mx-auto lg:mx-0'>
                    <Chart priceData={dummyPriceData} />
                </div>
            </div>
          </div>
      </div>

      <div className='w-full bg-[#0daaf9] py-24'>
          <h1 className='lg:text-6xl text-4xl text-center pb-20 lg:pt-0 font-semibold'>Start tracking your product today</h1>
          <div className='w-full flex justify-center text-xl'>
              {/* input */}
              <div className='relative flex lg:w-1/2 w-4/5 justify-center'>
                <div className='bg-white border border-white rounded-full lg:w-1/2 relative'>
                  <input type='text' placeholder='Product URL' className='p-3 bg-white border border-white rounded-full w-full outline-none text-black relative'></input>
                  <i onClick={goToLogin} className="bi bi-search text-3xl text-black absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"></i>
                </div>
              </div>
              
          </div>
      </div>

      {/* Footer */}
      <div className='w-full p-3 text-center'>
        <p>Made by <a target="_blank" className='text-[#0daaf9] hover:underline' href='https://sandersekreve.nl'>Sander Sekreve</a></p>
      </div>

      {/* arrow */}
      {isTopPage ? (
        <div className='fixed bottom-20 text-center w-full z-30'>
            <i onClick={() => scrollDown()} className={`bi bi-arrow-down-circle-fill h-12 w-12 text-[#0daaf9] text-6xl mt-10 font-bold mx-auto hidden lg:block cursor-pointer hover:scale-125 duration-150 animate-bounce ${isTopPage ? 'opacity-100' : 'opacity-0 transition-opacity duration-500'}`}></i>
        </div>
      ) : (null)}
    </main>
  );
}
