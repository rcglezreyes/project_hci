import { CONFIG } from 'src/config-global';

// ----------------------------------------------------------------------

export const _mock = {
  // Image
  image: {
    cover: (index) => `${CONFIG.assetsDir}/assets/images/mock/cover/cover-${index + 1}.webp`,
    avatar: (index) => `${CONFIG.assetsDir}/assets/images/mock/avatar/avatar-${index + 1}.webp`,
    travel: (index) => `${CONFIG.assetsDir}/assets/images/mock/travel/travel-${index + 1}.webp`,
    course: (index) => `${CONFIG.assetsDir}/assets/images/mock/course/course-${index + 1}.webp`,
    company: (index) => `${CONFIG.assetsDir}/assets/images/mock/company/company-${index + 1}.webp`,
    product: (index) =>
      `${CONFIG.assetsDir}/assets/images/mock/m-product/product-${index + 1}.webp`,
    portrait: (index) =>
      `${CONFIG.assetsDir}/assets/images/mock/portrait/portrait-${index + 1}.webp`,
  },
};
