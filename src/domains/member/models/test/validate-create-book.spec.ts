import { CreateMemberDto, validateCreateMemberDto } from '../create-member.dto';

describe('validateCreateMemberDto()', () => {
  it('should give no error when required field is filled correctly', () => {
    const payload = {
      code: 'test1',
      name: 'test1',
    } as CreateMemberDto;

    const errResp = validateCreateMemberDto(payload);

    expect(errResp.errors.length).toBe(0);
  });

  it('should give 2 error when required field is empty or undefined', () => {
    const payload = {
      code: '',
      name: '',
    } as CreateMemberDto;

    const errResp = validateCreateMemberDto(payload);
    const expected = [
      {
        title: 'CODE ERROR',
        detail: 'Code cannot be empty',
      },
      {
        title: 'NAME ERROR',
        detail: 'Name cannot be empty',
      },
    ];

    expect(errResp.errors.length).toBe(2);
    expect(errResp.errors).toEqual(expect.arrayContaining(expected));
  });
});
