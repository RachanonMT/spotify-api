export default function ConvertMs(milliseconds, type) {
     let seconds = Math.floor(milliseconds / 1000);
     let minutes = Math.floor(seconds / 60);
     let hours = Math.floor(minutes / 60);
     seconds = seconds % 60;
     minutes = minutes % 60;
     hours = hours % 24;
     seconds = (seconds < 10)? `0${seconds}`:seconds
     hours = (hours < 10)? `${hours}`:hours
     if(type)
          return    (parseInt(hours)) ? `${hours} hr ${minutes} min ${seconds} sec`:
                    (parseInt(minutes)) ? `${minutes} min ${seconds} sec`:`00 min ${seconds} sec`
     else
          return    (parseInt(hours)) ? `${hours} : ${minutes} : ${seconds}`:
                    (parseInt(minutes)) ? `${minutes}:${seconds}`:`00:${seconds}` 
}
