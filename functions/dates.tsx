// export const checkTimeSince = (time)=>{
//     const t2 = new Date();
//     let t = (t2 - time ) / (1000*3600*24);
//     let hr = (t2 - time ) / (1000*3600);
//     let min = (t2 - time ) / (1000*60)
// // console.log(t/365)
//     if(t>365){
//         return `Started ${(Math.floor(t/365))} years ago`;
//     }
//     else if(t===365){
//         return `Started ${(Math.floor(t/365))} year ago`;
//     }
//     else if(t===30){
//         return `Started ${(Math.floor(t/30))} month ago`;
//     }
//     else if(t>30 && t<365){
//         return `Started ${(Math.floor(t/30))} months ago`;
//     }
//     else if(t===7){
//         return `Started ${(Math.floor(t/7))} week ago`;
//     }
//     else if(t>7 && t <30){
//         return `Started ${(Math.floor(t/7))} weeks ago`;
//     }
//     else if(t===1){
//         return `Started ${(Math.floor(t/1))} yesterday`;
//     }
//     else if(t>1 && t< 7){
//         return `Started ${(Math.floor(t/1))} days ago`;
//     }
//     else if(hr===1){
//         return `Started ${(Math.floor(hr/1))} an hour ago`;
//     }
//     else if(hr>1 && hr < 24){
//         return `Started ${(Math.floor(hr/1))} hours ago`;
//     }
//     else if(min===1){
//         return `Started ${(Math.floor(min/1))} a minute ago`;
//     }
//     else if(min>1 && min < 60){
//         return `Started ${(Math.floor(min/1))} minutes ago`;
//     }
//     else if(min<1){
//         return `Started just now`;
//     }
// }


export const checkTimeSince = (time: Date) => {
    const t2 = new Date();
    let t = (t2.getTime() - time.getTime()) / (1000 * 3600 * 24);
    let hr = (t2.getTime() - time.getTime()) / (1000 * 3600);
    let min = (t2.getTime() - time.getTime()) / (1000 * 60);
  
    if (t > 365) {
      return `Scheduled ${Math.floor(t / 365)} years ago`;
    } else if (t === 365) {
      return `Scheduled ${Math.floor(t / 365)} year ago`;
    } else if (t === 30) {
      return `Scheduled ${Math.floor(t / 30)} month ago`;
    } else if (t > 30 && t < 365) {
      return `Scheduled ${Math.floor(t / 30)} months ago`;
    } else if (t === 7) {
      return `Scheduled ${Math.floor(t / 7)} week ago`;
    } else if (t > 7 && t < 30) {
      return `Scheduled ${Math.floor(t / 7)} weeks ago`;
    } else if (t === 1) {
      return `Scheduled ${Math.floor(t / 1)} yesterday`;
    } else if (t > 1 && t < 7) {
      return `Scheduled ${Math.floor(t / 1)} days ago`;
    } else if (hr === 1) {
      return `Scheduled ${Math.floor(hr / 1)} an hour ago`;
    } else if (hr > 1 && hr < 24) {
      return `Scheduled ${Math.floor(hr / 1)} hours ago`;
    } else if (min === 1) {
      return `Scheduled ${Math.floor(min / 1)} a minute ago`;
    } else if (min > 1 && min < 60) {
      return `Scheduled ${Math.floor(min / 1)} minutes ago`;
    } else if (min < 1) {
      return `Scheduled just now`;
    }
  };


export const timeRemaining = (time: Date) => {
    const now = new Date();
    let t = (time.getTime() - now.getTime()) / (1000 * 3600 * 24);
    let hr = (time.getTime() - now.getTime()) / (1000 * 3600);
    let min = (time.getTime() - now.getTime()) / (1000 * 60);
  
    if (t > 365) {
      return `About ${Math.floor(t / 365)} years remaining`;
    } else if (t === 365) {
      return `About ${Math.floor(t / 365)} year remaining`;
    } else if (t === 30) {
      return `About ${Math.floor(t / 30)} month remaining`;
    } else if (t > 30 && t < 365) {
      return `About ${Math.floor(t / 30)} months remaining`;
    } else if (t === 7) {
      return `About ${Math.floor(t / 7)} week remaining`;
    } else if (t > 7 && t < 30) {
      return `About ${Math.floor(t / 7)} weeks remaining`;
    } else if (t === 1) {
      return `About ${Math.floor(t / 1)} tomorrow`;
    } else if (t > 1 && t < 7) {
      return `About ${Math.floor(t / 1)} days remaining`;
    } else if (hr === 1) {
      return `About ${Math.floor(hr / 1)} hour remaining`;
    } else if (hr > 1 && hr < 24) {
      return `About ${Math.floor(hr / 1)} hours remaining`;
    } else if (min === 1) {
      return `About ${Math.floor(min / 1)} a minute remaining`;
    } else if (min > 1 && min < 60) {
      return `About ${Math.floor(min / 1)} minutes remaining`;
    } else if (min < 1) {
      return `About ending now`;
    }
  };

// export const timeRemaining = (time:Date)=>{
//     const now:Date = new Date();
//     let t = (time -now ) / (1000*3600*24);
//     let hr = (time-now ) / (1000*3600);
//     let min = (time - now ) / (1000*60);

//     if(t>365){
//         return `About ${(Math.floor(t/365))} years remaining`;
//     }
//     else if(t===365){
//         return `About ${(Math.floor(t/365))} year remaining`;
//     }
//     else if(t===30){
//         return `About ${(Math.floor(t/30))} month remaining`;
//     }
//     else if(t>30 && t<365){
//         return `About ${(Math.floor(t/30))} months remaining`;
//     }
//     else if(t===7){
//         return `About ${(Math.floor(t/7))} week remaining`;
//     }
//     else if(t>7 && t <30){
//         return `About ${(Math.floor(t/7))} weeks remaining`;
//     }
//     else if(t===1){
//         return `About ${(Math.floor(t/1))} tomorrow`;
//     }
//     else if(t>1 && t< 7){
//         return `About ${(Math.floor(t/1))} days remaining`;
//     }
//     else if(hr===1){
//         return `About ${(Math.floor(hr/1))} hour remaining`;
//     }
//     else if(hr>1 && hr < 24){
//         return `About ${(Math.floor(hr/1))} hours remaining`;
//     }
//     else if(min===1){
//         return `About ${(Math.floor(min/1))} a minute remaining`;
//     }
//     else if(min>1 && min < 60){
//         return `About ${(Math.floor(min/1))} minutes remaining`;
//     }
//     else if(min<1){
//         return `About ending now`;
//     }
// }
