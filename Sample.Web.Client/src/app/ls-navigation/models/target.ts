import { SectionInterface } from './section.interface';

export class Target {
    private section: SectionInterface;
    private offset: number;
    public Position: number;
    
    constructor(offset: number) {
      this.offset = offset; 
    }
  
    public Set(section : SectionInterface) {
      this.section = section;
      this.Position = (section) ? section.getOffsetTop() + this.offset : 0;
    }

    public get IsSection() : boolean {
      return (this.section!=null);
    }
  
    public ScrollToPosition() {
      setTimeout(() => {   
        this.Set(this.section); // to update Position to the most current fragment position
        console.log("scroll-to:" + this.Position );
        window.scroll({behavior: 'smooth', top:this.Position}); // start scrolling
        setTimeout(() => {                                      // .. after 50 ms
          if (this.PositionHasChanged)                          // check for position-setpoint change ( due to slow page loading )
            this.ScrollToPosition();                            // and retrigger scroll with new position-setpoint
        }, 50);                                                 
      },0);
    }
  
    public get PositionHasChanged() : boolean {
      if (this.IsSection) {
        let p = this.section.getOffsetTop() + this.offset;
        if (p != this.Position) {
          this.Position = p;
          return true;
        }
        return false;
      }
    }    
  }
