import type { TechynicalCareer } from "../interfaces/TechnicalCareer";

export const getTechnicalCareerService = (): Promise<TechynicalCareer[]> => {
    return new Promise((resolve,reject) => {
        console.log('Consultada data Careers');
        setTimeout(() => {
            const careers: TechynicalCareer[] = [
                {
                    careerId: '1',
                    name: 'Mecanica Automotriz',
                    description: 'Curso en el área de <span class="text-color-kalum">MECANICA AUTOMOTRIZ</span> con estandares industriales a nivel mundial.',
                    subTitle: 'Técnologico Kalum',
                    image: 'mecanica.jpg'
                },
                {
                    careerId: '2',
                    name: 'Electronica Industrial',
                    description: 'Curso en el área de <span class="text-color-kalum"> ELECTRONICA INDUSTRIAL</span> con estandares industriales a nivel mundial.',
                    subTitle: 'Técnologico Kalum',
                    image: 'eleccom.jpg'
                },
                {
                    careerId: '3',
                    name: 'Electricidad Industrial',
                    description: 'Curso en el área de <span class="text-color-kalum"> ELECTRICIDAD INDUSTRIAL</span> con estandares industriales a nivel mundial.',
                    subTitle: 'Técnologico Kalum',
                    image: 'electricidad.jpg'
                },
                {
                    careerId: '4',
                    name: 'Tics - Full Stack Java EE',
                    description: 'Curso en el área de <span class="text-color-kalum">DESARROLLO DE SOFTWARE</span> con estandares industriales a nivel mundial.',
                    subTitle: 'Técnologico Kalum',
                    image: 'tics.jpg'
                }
            ];
            resolve(careers);
        }, 2000);
    });

}