const BASE_URL = 'http://localhost:3000';

async function verify() {
  try {
    console.log('Starting API Verification...');

    // 1. Login as User
    console.log('1. Logging in as User...');
    const userRes = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'user@test.com', password: 'password123' })
    });
    
    if (!userRes.ok) throw new Error('User login failed');
    const userCookie = userRes.headers.get('set-cookie');
    console.log('   User Logged In.');

    // 2. Login as Admin
    console.log('2. Logging in as Admin...');
    const adminRes = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@test.com', password: 'password123' })
    });

    if (!adminRes.ok) throw new Error('Admin login failed');
    const adminCookie = adminRes.headers.get('set-cookie');
    console.log('   Admin Logged In.');

    // 3. Get Businesses (as User) to find an ID
    console.log('3. Fetching Businesses as User (limit=100)...');
    const getRes = await fetch(`${BASE_URL}/api/businesses?limit=100`, {
        headers: { Cookie: userCookie }
    });
    const getData = await getRes.json();
    if (!getData.success || getData.data.length === 0) throw new Error('No businesses found to test');
    
    const targetBizIdx = getData.data.findIndex(b => b.placeId === 'test-place-id');
    const targetBiz = targetBizIdx !== -1 ? getData.data[targetBizIdx] : getData.data[0];
    const bizId = targetBiz._id;
    console.log(`   Target Business ID: ${bizId}`);
    // console.log(`   Initial isDeleted: ${targetBiz.isDeleted}`); // Should be false/undefined

    // 4. Soft Delete (as User)
    console.log('4. Soft Deleting as User...');
    const delRes = await fetch(`${BASE_URL}/api/businesses/${bizId}/soft-delete`, {
        method: 'PATCH',
        headers: { Cookie: userCookie }
    });
    const delJson = await delRes.json();
    if (!delRes.ok) throw new Error(`Soft Delete Failed: ${delJson.message}`);
    console.log('   Soft Delete Success.');

    // 5. Verify it's gone for User
    console.log('5. Verifying disappearance for User...');
    const verifyUserRes = await fetch(`${BASE_URL}/api/businesses?limit=100`, {
        headers: { Cookie: userCookie }
    });
    const verifyUserData = await verifyUserRes.json();
    const foundUser = verifyUserData.data.find(b => b._id === bizId);
    if (foundUser) throw new Error('Business still visible to User after soft delete!');
    console.log('   Business is hidden for User.');

    // 6. Verify it's visible for Admin (as Deleted)
    console.log('6. Verifying visibility for Admin...');
    const verifyAdminRes = await fetch(`${BASE_URL}/api/businesses?isAdmin=true&limit=100`, {
        headers: { Cookie: adminCookie }
    });
    const verifyAdminData = await verifyAdminRes.json();
    console.log(`   Admin sees ${verifyAdminData.data.length} businesses.`);
    // Since we added deleted count logic, let's check result
    const foundAdmin = verifyAdminData.data.find(b => b._id === bizId);
    if (!foundAdmin) throw new Error('Business NOT visible to Admin!');
    if (!foundAdmin.isDeleted) throw new Error('Business is not marked as deleted for Admin!');
    console.log('   Business is visible and marked deleted for Admin.');

    // 7. Restore (as Admin)
    console.log('7. Restoring as Admin...');
    const restoreRes = await fetch(`${BASE_URL}/api/businesses/${bizId}/restore`, {
        method: 'PATCH',
        headers: { Cookie: adminCookie }
    });
    if (!restoreRes.ok) throw new Error('Restore Failed');
    const restoreJson = await restoreRes.json();
    console.log('   Restore Success:', restoreJson);

    // 7a. Verify Restore status via Admin fetch
    console.log('7a. Verifying restore status via Admin fetch...');
    const postRestoreAdminRes = await fetch(`${BASE_URL}/api/businesses?isAdmin=true&limit=100`, {
        headers: { Cookie: adminCookie }
    });
    const postRestoreAdminData = await postRestoreAdminRes.json();
    const foundPostRestore = postRestoreAdminData.data.find(b => b._id === bizId);
    if (foundPostRestore) {
        console.log(`   Admin checks ID ${bizId}: isDeleted=${foundPostRestore.isDeleted}`);
    } else {
        console.log(`   Business ${bizId} NOT found by Admin post-restore!`);
    }

    // 8. Verify it's back for User
    console.log('8. Verifying reappearance for User...');
    const finalVerifyRes = await fetch(`${BASE_URL}/api/businesses?limit=100`, {
        headers: { Cookie: userCookie }
    });
    const finalVerifyData = await finalVerifyRes.json();
    
    // Debug log
    const allIds = finalVerifyData.data.map(b => b._id);
    console.log(`   User sees IDs: ${allIds.join(', ')}`);
    
    const finalFound = finalVerifyData.data.find(b => b._id === bizId);
    if (!finalFound) throw new Error('Business NOT visible to User after restore!');
    console.log('   Business is back for User.');

    console.log('\n✅ ALL SYSTEMS GO! Dual-Role Workflow Verified.');

  } catch (error) {
    console.error('\n❌ VERIFICATION FAILED:', error.message);
    process.exit(1);
  }
}

verify();
