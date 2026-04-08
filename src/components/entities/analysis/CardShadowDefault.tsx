// карта с настройками default
const CardShadowDefault = ({children,header}
                            : {children:any,header:string}) =>
    <div className="text-center mb-2 p-3 rounded shadow-sm bg-light">
        <h5 className="text-muted">{header}</h5>
        {children}
    </div>
export default CardShadowDefault;