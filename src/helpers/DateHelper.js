export function dateToString(date){
    const _date=new Date(date);
    const year=_date.getFullYear();
    const month=_date.getMonth()+1;
    const day=_date.getDate();

    return `${day}/${month}/${year}`;

}

