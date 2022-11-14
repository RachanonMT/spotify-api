export default function AddedDate(added) {
     const date      = new Date();
     const day       = parseInt( added.substring(8, 10)) + 10
     const month     = parseInt( added.substring(5, 7) ) + 10
     const year      = added.substring(0, 4)
     const nowDay    = date.getDate()  + 10
     const nowMonth  = date.getMonth() + 11
     const nowYear   = date.getFullYear()
     
     if (year == nowYear && month == nowMonth && day == nowDay) 
          return "Today"
     else if(year == nowYear && month == nowMonth && day == nowDay - 1) 
          return "Yesterday"
     else if(year == nowYear && month == nowMonth && day > nowDay - 7) 
          return "This Week"
     else if(year == nowYear && month == nowMonth && day > nowDay - 14) 
          return "Last Week"
     else if(year == nowYear && month == nowMonth) 
          return "This Month"
     else if(year == nowYear && month == nowMonth - 1) 
          return "Last Month"
     else 
          return `${month-10}/${day-10}/${year}`
}
