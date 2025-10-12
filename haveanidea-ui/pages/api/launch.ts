import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { creator, title, description, iconHash, tags, crowdfunding, socialMedia, timestamp, txHash } = req.body || {};

  if (!creator || !title || !description) {
    return res.status(400).json({ message: 'Missing required fields: creator, title, description' });
  }

  if (!txHash) {
    return res.status(400).json({ message: 'Transaction hash is required for blockchain verification' });
  }

  if (crowdfunding && !crowdfunding.price) {
    return res.status(400).json({ message: 'Funding price is required for crowdfunding campaign' });
  }

  if (crowdfunding && crowdfunding.mode === 'token' && !crowdfunding.tokenSymbol) {
    return res.status(400).json({ message: 'Token symbol is required for token crowdfunding' });
  }

  if (crowdfunding && !socialMedia?.twitter && !socialMedia?.discord && !socialMedia?.telegram) {
    return res.status(400).json({ message: 'At least one contact method is required for crowdfunding campaign' });
  }

  // TODO: Verify transaction hash on blockchain
  // TODO: Store in database for indexing and search
  // eslint-disable-next-line no-console
  console.log('[BLOCKCHAIN IDEA INDEXED]', { 
    creator,
    title,
    descriptionLength: (description || '').length,
    iconHash,
    tags: Array.isArray(tags) ? tags : [],
    crowdfunding,
    socialMedia,
    txHash,
    timestamp: timestamp || new Date().toISOString()
  });

  return res.status(200).json({ message: 'OK' });
}
