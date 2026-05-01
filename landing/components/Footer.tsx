export function Footer() {
  return (
    <footer className="w-full bg-black border-t border-border py-8 px-6 mt-20 relative z-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 font-mono text-xs md:text-sm text-muted">
        <div className="text-white font-bold tracking-wider">
          SlimedOut™
        </div>
        
        <div className="text-center md:max-w-xl opacity-70">
          SlimedOut is not affiliated with LinkedIn. This is a joke. 
          <br className="hidden md:block"/> Please don't actually fight anyone.
        </div>
        
        <div className="text-right opacity-50">
          Built at Google × GitCloud Hackathon
          <br/> 
          May 2026
        </div>
      </div>
    </footer>
  );
}
