
export function getResourceFromPath(pathname?: string) {

    if (!pathname) return '';
    
    // @ts-ignore
    const clean = pathname.split('?')[0].replace(/\/+$/, '');

    const parts = clean.split('/').filter(Boolean);

    if (parts.length === 0) return '';

    const isParam = (segment: string) => /\d/.test(segment);

    const last = parts[parts.length - 1];

    if (last && !isParam(last)) {
        return last;
    }

    if (parts.length >= 2) {
        return parts[parts.length - 2];
    }

    return last;

}

export const translateRessource = (last : string)=>{

    let text = last;

    if(last == "platform"){
        text = "Tableau de bord"
    }

    else if ( last == "projects"){
        text = "Mes dossiers"
    }

    else if ( last == "create"){
        text = "Creer un dossier"
    }

    return text
}

