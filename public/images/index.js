import csdept from './csdept1.jpg';

export { csdept };

const s3BucketBaseUrl = 'https://s3.tebi.io/shuats-quiz-app/catalogue-pics';

const cataloguePics = {
	admin: [`${s3BucketBaseUrl}/admin/admin0.jpg`],
	agri: [`${s3BucketBaseUrl}/agri/agri0.jpg`],
	animal: [`${s3BucketBaseUrl}/animal/animal.jpg`],
	art: [`${s3BucketBaseUrl}/art/art0.jpg`, `${s3BucketBaseUrl}/art/art1.jpg`],
	biotech: [
		`${s3BucketBaseUrl}/biotech/biotech0.jpg`,
		`${s3BucketBaseUrl}/biotech/biotech1.jpg`,
		`${s3BucketBaseUrl}/biotech/biotech2.jpg`,
		`${s3BucketBaseUrl}/biotech/biotech3.jpg`,
		`${s3BucketBaseUrl}/biotech/biotech4.jpg`,
		`${s3BucketBaseUrl}/biotech/biotech5.jpg`,
	],
	btech: [
		`${s3BucketBaseUrl}/btech/btech0.jpg`,
		`${s3BucketBaseUrl}/btech/btech1.jpg`,
	],
	cultural: [
		`${s3BucketBaseUrl}/cultural/cultural0.jpg`,
		`${s3BucketBaseUrl}/cultural/cultural1.jpg`,
		`${s3BucketBaseUrl}/cultural/cultural10.png`,
		`${s3BucketBaseUrl}/cultural/cultural11.jpg`,
		`${s3BucketBaseUrl}/cultural/cultural2.jpg`,
		`${s3BucketBaseUrl}/cultural/cultural3.jpg`,
		`${s3BucketBaseUrl}/cultural/cultural4.jpg`,
		`${s3BucketBaseUrl}/cultural/cultural5.jpg`,
		`${s3BucketBaseUrl}/cultural/cultural6.jpg`,
		`${s3BucketBaseUrl}/cultural/cultural7.jpg`,
		`${s3BucketBaseUrl}/cultural/cultural8.jpg`,
		`${s3BucketBaseUrl}/cultural/cultural9.jpg`,
	],
	dept: [
		`${s3BucketBaseUrl}/dept/dept0.jpg`,
		`${s3BucketBaseUrl}/dept/dept1.jpg`,
		`${s3BucketBaseUrl}/dept/dept2.jpg`,
	],
	env: [
		`${s3BucketBaseUrl}/env/env.jpg`,
		`${s3BucketBaseUrl}/env/env0.jpg`,
		`${s3BucketBaseUrl}/env/env1.jpg`,
		`${s3BucketBaseUrl}/env/env10.jpg`,
		`${s3BucketBaseUrl}/env/env11.jpg`,
		`${s3BucketBaseUrl}/env/env12.jpg`,
		`${s3BucketBaseUrl}/env/env13.jpg`,
		`${s3BucketBaseUrl}/env/env14.png`,
		`${s3BucketBaseUrl}/env/env2.jpg`,
		`${s3BucketBaseUrl}/env/env3.jpg`,
		`${s3BucketBaseUrl}/env/env4.jpg`,
		`${s3BucketBaseUrl}/env/env5.jpg`,
		`${s3BucketBaseUrl}/env/env6.jpg`,
		`${s3BucketBaseUrl}/env/env7.jpg`,
		`${s3BucketBaseUrl}/env/env8.jpg`,
		`${s3BucketBaseUrl}/env/env9.jpg`,
	],
	fac_sci: [`${s3BucketBaseUrl}/fac_sci/fac_sci1.jpg`],
	field: [
		`${s3BucketBaseUrl}/field/field.jpg`,
		`${s3BucketBaseUrl}/field/field1.png`,
	],
	hostel: [
		`${s3BucketBaseUrl}/hostel/hostel.jpg`,
		`${s3BucketBaseUrl}/hostel/hostel1-1.jpg`,
		`${s3BucketBaseUrl}/hostel/hostel1-2.jpg`,
		`${s3BucketBaseUrl}/hostel/hostel1-3.jpg`,
		`${s3BucketBaseUrl}/hostel/hostel1-4.jpg`,
		`${s3BucketBaseUrl}/hostel/hostel1-5.jpg`,
		`${s3BucketBaseUrl}/hostel/hostel1-6.jpg`,
		`${s3BucketBaseUrl}/hostel/hostel1-7.jpg`,
		`${s3BucketBaseUrl}/hostel/hostel1.jpg`,
		`${s3BucketBaseUrl}/hostel/hostel2.jpg`,
	],
	lab: [
		`${s3BucketBaseUrl}/lab/lab0.jpeg`,
		`${s3BucketBaseUrl}/lab/lab1.jpg`,
		`${s3BucketBaseUrl}/lab/lab2.jpeg`,
	],
	librarys: [
		`${s3BucketBaseUrl}/librarys/lib.jpg`,
		`${s3BucketBaseUrl}/librarys/lib1.jpg`,
	],
	masscom: [`${s3BucketBaseUrl}/masscom/masscom0.jpg`],
	mesh: [
		`${s3BucketBaseUrl}/mesh/mesh1-0.jpg`,
		`${s3BucketBaseUrl}/mesh/mesh1-1.jpg`,
	],
	nav: [
		`${s3BucketBaseUrl}/nav/nav0.jpg`,
		`${s3BucketBaseUrl}/nav/nav1.jpg`,
		`${s3BucketBaseUrl}/nav/nav2.jpg`,
	],
	ncc: [`${s3BucketBaseUrl}/ncc/ncc0.jpg`, `${s3BucketBaseUrl}/ncc/ncc1.jpg`],
	sports: [
		`${s3BucketBaseUrl}/sports/sports0.jpg`,
		`${s3BucketBaseUrl}/sports/sports1.jpg`,
		`${s3BucketBaseUrl}/sports/sports2.jpg`,
		`${s3BucketBaseUrl}/sports/sports3.jpg`,
		`${s3BucketBaseUrl}/sports/sports4.jpg`,
	],
};

export const logo = `${s3BucketBaseUrl}/SHIATS_LOGO_hq.png`;

export default cataloguePics;
