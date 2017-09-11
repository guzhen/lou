//---------------------------
// html generator
function makeoneweek(week)
{
    if (week===undefined)
    {
        return "<td class=\"blank\"></td>"
    }
    else
    {
        return "<td><font color=\""+week.color+"\">"+week.mday+"<br />"+week.work+"</font></td>"
    }
}
function makeweeks(weeks)
{
    var outter = document.createElement("div")
    for(var i=0;i<weeks.length;i++)
    {
        var tr=document.createElement("tr");
        tr.innerHTML+=makeoneweek(weeks[i][1]);
        tr.innerHTML+=makeoneweek(weeks[i][2]);
        tr.innerHTML+=makeoneweek(weeks[i][3]);
        tr.innerHTML+=makeoneweek(weeks[i][4]);
        tr.innerHTML+=makeoneweek(weeks[i][5]);
        tr.innerHTML+=makeoneweek(weeks[i][6]);
        tr.innerHTML+=makeoneweek(weeks[i][0]);
        outter.appendChild(tr);
    }
    return outter.innerHTML;
}
function maketbl(year, mon, weeks)
{
    var tbl=document.createElement("table");
    var month=document.createElement("td");
    month.className="month";
    month.align="center";
    month.colSpan="7";
    month.appendChild(document.createTextNode(year+"年/"+mon+"月"));
    var tr=document.createElement("tr");
    tr.appendChild(month);
    tbl.appendChild(tr);
    var header="<tr><td>一</td><td>二</td><td>三</td><td>四</td><td>五</td><td>六</td><td>日</td></tr>";
    tbl.innerHTML+=header;
    tbl.innerHTML+=weeks;
    return tbl;
}
function writehtml(result)
{
    var body=document.getElementsByTagName("div")[0];
    body.innerHTML="";
    for(var i=0;i<result.length;i++)
    {
        var y=result[i].year;
        var m=result[i].month+1;
        var w=makeweeks(result[i].weeks);
        body.appendChild(maketbl(y,m,w));
        body.appendChild(document.createElement("br"));
    }
}
//-------------------------
//       parse
var startdate=[2016,11,2,0];
function shiftindex(target)
{
    var data=startdate;
    var origin_t=new Date(data[0], data[1]-1,data[2]);
    var target_t=new Date(target[0], target[1]-1, target[2]);
    var days=(target_t-origin_t)/(1000*60*60*24);
    return (data[3]+days);
}
function louparse(target, page_len)
{
    var work=["午1", "午2", "夜1", "夜2", "休1", "休2"];
    var color=["green", "green", "red", "red", "#FFCC00", "#FFCC00"];
    var index = shiftindex(target) % work.length;
    if (index < 0) {index += work.length;}
    var target_t=new Date(target[0], target[1]-1, target[2]);
    var current = new Date(target[0], target[1]-1, target[2]);
    var day_len = 1000*60*60*24;

    var mon_index=0;
    var week_index=0;

    result=new Array();
    while((mon_index+1) <= page_len)
    {
        current_month = current.getMonth();
        result[mon_index] = new Object()
        result[mon_index].year=current.getFullYear();
        result[mon_index].month=current.getMonth();
        result[mon_index].weeks=new Array();
        week_index = 0;
        result[mon_index].weeks[week_index]=new Array();
        while(current.getMonth() === current_month)
        {
            result[mon_index].weeks[week_index][current.getDay()]={mday:current.getDate(), work:work[index], color:color[index]}
            index++;
            index=index % work.length;
            current = new Date(current.valueOf() + day_len);
            if(current.getDay()===1)
            {
                week_index++;
                result[mon_index].weeks[week_index]=new Array();
            }
        }
        mon_index++;
    }
    return result;
}
//-------------------------
//       main
function freshpage()
{
    var now=new Date();
    var target=[now.getFullYear(),now.getMonth()+1,now.getDate()];
    var page_len=2;
    document.getElementById("iyear").value=target[0];
    document.getElementById("imonth").value=target[1];
    document.getElementById("iday").value=target[2];
    document.getElementById("ipage_len").value=page_len;
    writehtml(louparse(target, page_len));
}
function refreshpage()
{
    var target=[
        document.getElementById("iyear").value,
        document.getElementById("imonth").value,
        document.getElementById("iday").value
            ];
    var page_len=document.getElementById("ipage_len").value;
    writehtml(louparse(target, page_len));
}
function redefine()
{
    startdate=[
        document.getElementById("syear").value,
        document.getElementById("smonth").value,
        document.getElementById("sday").value,0];
    refreshpage()
}
