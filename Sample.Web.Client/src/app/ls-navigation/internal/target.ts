import { FragmentInterface } from './fragment.interface';

export class Target {
    private fragment: FragmentInterface;
    private offset: number;
    public Position: number;
    constructor(offset: number) {
      this.offset = offset; 
    }
  
    public Set(fragment : FragmentInterface) {
      this.fragment = fragment;
      this.Position = (fragment) ? fragment.getOffsetTop() + this.offset : 0;
    }
    
    public get IsFragment() : boolean {
      return (this.fragment!=null);
    }
  
    public ScrollToPosition() {
      setTimeout(() => {      
        console.log("scrollto:" + this.Position );
        window.scroll({behavior: 'smooth', top:this.Position}); 
      },0);
    }
  
    public get PositionHasChanged() : boolean {
      if (this.IsFragment) {
        let p = this.fragment.getOffsetTop() + this.offset;
        if (p != this.Position) {
          this.Position = p;
          return true;
        }
        return false;
      }
    }
  }