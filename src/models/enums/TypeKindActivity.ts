// A — сельское хозяйство, лесоводство, рыболовство;
// C — производство(от продуктов питания до электроники);
// F — строительство;
// G — торговля;
// I — гостиницы и рестораны;
// M — профессиональные услуги(юристы, бухгалтеры, дизайнеры);
// S — персональные услуги(парикмахерские, ремонт, стирка).
export enum TypeKindActivity
{
    A,C,F,G,I,M,S
};


// константы
// тип A
const DEFINE_A = 'A — сельское хозяйство, лесоводство, рыболовство';
// тип C
const DEFINE_C = 'C — производство(от продуктов питания до электроники)';
// тип F
const DEFINE_F = 'F — строительство';
// тип G
const DEFINE_G = 'G — торговля';
// тип I
const DEFINE_I = 'I — гостиницы и рестораны';
// тип M
const DEFINE_M = 'M — профессиональные услуги (юристы, бухгалтеры, дизайнеры)';
// тип S
const DEFINE_S = 'S — персональные услуги (парикмахерские, ремонт, стирка).';


export const convertTypeKindActivity =
    (t:TypeKindActivity):string => {

       switch (t) {
           case TypeKindActivity.A: return DEFINE_A;
           case TypeKindActivity.C: return DEFINE_C;
           case TypeKindActivity.F: return DEFINE_F;
           case TypeKindActivity.G: return DEFINE_G;
           case TypeKindActivity.I: return DEFINE_I;
           case TypeKindActivity.M: return DEFINE_M;
           case TypeKindActivity.S: return DEFINE_S;
           default: return "";
       };
};

export const mapKindActivityArray = ():{type:TypeKindActivity,explain:string}[] =>
     [
         {type:TypeKindActivity.A,explain:DEFINE_A},
         {type:TypeKindActivity.S,explain:DEFINE_S},
         {type:TypeKindActivity.M,explain:DEFINE_M},
         {type:TypeKindActivity.G,explain:DEFINE_G},
         {type:TypeKindActivity.I,explain:DEFINE_I},
         {type:TypeKindActivity.C,explain:DEFINE_C},
         {type:TypeKindActivity.F,explain:DEFINE_F},

     ];