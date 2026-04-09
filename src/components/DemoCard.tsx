export default function DemoCard() {
  return (
    <div className="max-w-sm mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl m-8">
      <div className="md:flex">
        <div className="md:shrink-0">
          <div className="h-48 w-full object-cover md:h-full md:w-48 bg-gradient-to-r from-purple-400 to-pink-400"></div>
        </div>
        <div className="p-8">
          <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
            Kosa Store Demo
          </div>
          <a href="#" className="block mt-1 text-lg leading-tight font-medium text-black hover:underline">
            Tailwind CSS is working perfectly!
          </a>
          <p className="mt-2 text-slate-500">
            This is a demo component showing that Tailwind CSS has been successfully configured with Next.js. 
            You can see the responsive design, colors, spacing, and typography are all working.
          </p>
          <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}
