const { Router } = require('express')
const {
  uploadBannerImage,
  uploadProfileImage,
  displayBanner,
  displayProfileImage,
  getAboutMe,
  updateAboutMe,
  getSiteRules,
  updateSiteRules,
  sendTinyApiKey,
} = require('../controllers/admin')
const { userAuth, adminCheck } = require('../middlewares/auth-middleware')
const router = Router()

router.post('/upload-banner-image', userAuth, adminCheck, uploadBannerImage)
router.post('/upload-profile-image', userAuth, adminCheck, uploadProfileImage)
router.get('/tiny-api-key', userAuth, adminCheck, sendTinyApiKey)
router.get('/banner', displayBanner)
router.get('/profile-image', displayProfileImage)
router.get('/about-me', getAboutMe)
router.post('/update-about-me', userAuth, adminCheck, updateAboutMe)
router.get('/site-rules', getSiteRules)
router.post('/update-site-rules', userAuth, adminCheck, updateSiteRules)

module.exports = router
